
function jestFakeTimersAreEnabled() {
    /* istanbul ignore else */
    if (typeof jest !== 'undefined' && jest !== null) {
        return (
            // legacy timers
            setTimeout._isMockFunction === true ||
            // modern timers
            Object.prototype.hasOwnProperty.call(setTimeout, 'clock')
        )
    }
    // istanbul ignore next
    return false
}


module.exports = {
    jestFakeTimersAreEnabled
}
