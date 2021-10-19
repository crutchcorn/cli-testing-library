
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
    _runObservers() {
        [..._observers.values()].forEach((cb) => cb());
    },
    MutationObserver
}
