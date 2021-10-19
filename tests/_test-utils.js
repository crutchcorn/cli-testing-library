const childProcess = require("child_process");
const { resolve } = require("path");
// v2
const stripFinalNewline = require("strip-final-newline");

// Used for `MutationObserver`. Unsure if it's really needed, but it's worth mentioning that these are not tied to
// specific CLI instances of `render`. This means that if there are e2e CLI tests that run in parallel, they will
// execute far more frequently than needed.
const _observers = new Map();

// Not perfect as a way to make "MutationObserver" unique IDs, but it should work
let mutId = 0;

class MutationObserver {
  constructor(cb) {
    this._id = ++mutId;
    this._cb = cb;
  }

  observe() {
    _observers.set(this._id, this._cb);
  }

  disconnect() {
    _observers.delete(this._id);
  }
}

module.exports = {
  /**
   * @param {Array} args
   * @param {Object} opts
   * @returns {execa.ExecaChildProcess | *}
   */
  async render(args = [], opts = {}) {
    const { cwd = __dirname } = opts;

    const exec = childProcess.spawn(
      resolve(__dirname, "../node_modules/.bin/nyc"),
      // TODO: Make generic & non-plop specific
      [
        "--silent",
        "node",
        resolve(__dirname, "../instrumented/bin/plop.js"),
        ...args,
      ],
      {
        cwd,
        shell: true,
      }
    );

    let _readyPromiseInternals = null;

    const additionalExecProps = {
      _isReady: new Promise(
        (resolve, reject) => (_readyPromiseInternals = { resolve, reject })
      ),
      // Clear buffer of stdout to do more accurate `t.regex` checks
      cleanup() {
        this.stdoutArr = [];
      },
      // An array of strings gathered from stdout when unable to do
      // `await stdout` because of inquirer interactive prompts
      stdoutArr: [],
      _runObservers() {
        [..._observers.values()].forEach((cb) => cb());
      },
    };

    exec.stdout.on("data", (result) => {
      const resStr = stripFinalNewline(result).toString();
      additionalExecProps.stdoutArr.push(resStr);
      additionalExecProps._runObservers();
      if (_readyPromiseInternals) _readyPromiseInternals.resolve();
    });

    exec.stdout.on("error", (result) => {
      if (_readyPromiseInternals) _readyPromiseInternals.reject(result);
    });

    exec.stderr.on("data", (result) => {
      if (_readyPromiseInternals)
        _readyPromiseInternals.reject(new Error(result));
    });

    await additionalExecProps._isReady;

    Object.assign(additionalExecProps, {
      stdin: exec.stdin,
      stdout: exec.stdout,
      stderr: exec.stderr,
    });

    return additionalExecProps;
  },
  MutationObserver,
  DOWN: "\x1B\x5B\x42",
  UP: "\x1B\x5B\x41",
  ENTER: "\x0D",
};
