const childProcess = require("child_process");
const { resolve } = require("path");
// v2
const stripFinalNewline = require("strip-final-newline");
const {_runObservers} = require('./_mutation-observer');

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

    const execOutputAPI = {
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
      get stdoutStr() {
        return this.stdoutArr.join("\n");
      },
    };

    exec.stdout.on("data", (result) => {
      const resStr = stripFinalNewline(result).toString();
      execOutputAPI.stdoutArr.push(resStr);
      _runObservers();
      if (_readyPromiseInternals) _readyPromiseInternals.resolve();
    });

    exec.stdout.on("error", (result) => {
      if (_readyPromiseInternals) _readyPromiseInternals.reject(result);
    });

    exec.stderr.on("data", (result) => {
      if (_readyPromiseInternals)
        _readyPromiseInternals.reject(new Error(result));
    });

    await execOutputAPI._isReady;

    Object.assign(execOutputAPI, {
      stdin: exec.stdin,
      stdout: exec.stdout,
      stderr: exec.stderr,
    });

    return execOutputAPI;
  }
};
