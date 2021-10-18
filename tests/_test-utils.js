const execa = require("execa");
const { resolve } = require("path");

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

    const exec = execa(
      "npx",
      // TODO: Make generic & non-plop specific
      [
        "nyc",
        "--silent",
        "node",
        resolve(__dirname, "../instrumented/bin/plop.js"),
        ...args,
      ],
      {
        cwd,
      }
    );

    let _readyPromiseInternals = null;
    const isReady = new Promise((resolve, reject) => (_readyPromiseInternals = {resolve, reject}));

    const additionalExecProps = {
      // Clear buffer of stdout to do more accurate `t.regex` checks
      cleanup() {
        this.stdoutArr = [];
      },
      // An array of strings gathered from stdout when unable to do
      // `await stdout` because of inquirer interactive prompts
      stdoutArr: [],
      _runObservers() {
        [..._observers.values()].forEach((cb) => cb());
      }
    };

    exec.stdout.on("data", (result) => {
      const resStr = result.toString();
      additionalExecProps.stdoutArr.push(resStr);
      additionalExecProps._runObservers();
      // if (isReady.pending) {
        console.log("IS READY IS READY NOW");
        _readyPromiseInternals.resolve(resStr);
      // }
    });

    exec.stdout.on("error", (result) => {
      const resStr = result.toString();
      if (isReady.pending) _readyPromiseInternals.reject(resStr);
    });

    exec.stderr.on('data', result => {
      if (isReady.pending) _readyPromiseInternals.reject(result.toString());
    })

    Object.assign(exec, additionalExecProps);

    console.log("BEFORE AWAIT")

    await isReady;

    console.log("AFTER AWAIT")

    return exec;
  },
  MutationObserver,
  DOWN: "\x1B\x5B\x42",
  UP: "\x1B\x5B\x41",
  ENTER: "\x0D",
  syncWait: (time = 200) =>
    new Promise((resolve) => {
      setTimeout(resolve, time);
    }),
};
