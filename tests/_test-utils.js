const execa = require("execa");
const { resolve } = require("path");

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

    const stdoutArr = [];

    let localResolve = null;
    const isReady = new Promise(resolve => localResolve = resolve);
    /**
     * Made an array so if, for some reason, we have more than a single
     * awaited promise on data waiting, this will call all of them, rather
     * than accidentally hanging
     *
     * @type {{promise: Promise, resolve: () => void}[]}
     */
    const additionalExecProps = {
      // Clear buffer of stdout to do more accurate `t.regex` checks
      cleanup() {
        this.stdoutArr = [];
      },
      // An array of strings gathered from stdout when unable to do
      // `await stdout` because of inquirer interactive prompts
      stdoutArr,
      _observers: new Map(),
      _runObservers() {
        [...this._observers.values()].forEach(cb => cb());
      }
    };

    // Not perfect as a way to make "MutationObserver" unique IDs, but it should work
    let mutId = 0;

    class MutationObserver {
      constructor(cb) {
        this._id = ++mutId;
        this._cb = cb;
      }

      observe() {
        additionalExecProps._observers.set(this._id, this._cb);
      }

      disconnect () {
        additionalExecProps._observers.delete(this._id);
      }
    }

    exec.stdout.on("data", (result) => {
      stdoutArr.push(result.toString());
      additionalExecProps._runObservers();
      if (!isReady.pending) localResolve();
    });

    Object.assign(exec, additionalExecProps, {MutationObserver});

    await isReady;

    return exec;
  },
  DOWN: "\x1B\x5B\x42",
  UP: "\x1B\x5B\x41",
  ENTER: "\x0D",
  syncWait: (time = 200) =>
    new Promise((resolve) => {
      setTimeout(resolve, time);
    }),
};
