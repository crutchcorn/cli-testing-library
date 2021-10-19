const {waitFor} = require("../_wait-for");

/**
 * @param {TestInstance} instance
 * @param {string} text
 * @returns {null|TestInstance}
 */
function getByText(instance, text) {
    const str = instance.stdoutStr;
    if (new RegExp(text).exec(str)) return instance;
    else return null;
}

/**
 *
 * @param {TestInstance} instance
 * @param {string} text
 * @returns {Promise<TestInstance>}
 */
function findByText(instance, text) {
    return waitFor(() =>
        new Promise((resolve) => {
            setTimeout(() => {
                resolve(getByText(instance, text));
            }, 0);
        })
    )
}

module.exports = {
    getByText,
    findByText
}
