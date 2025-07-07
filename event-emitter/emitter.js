
class Emitter {
    eventMap;

    constructor() {
        this.eventMap = {};
    }

    AddEvent(event, fn) {
        if (!this.eventMap[event]) {
            this.eventMap[event] = [fn];
        } else {
            this.eventMap[event].push(fn);
        }
    }

    Emit(event, ...args) {
        if (this.eventMap[event]) {
            for (const func of this.eventMap[event]) {
                func(...args);
            }
        }
    }

    RemoveEvent(event) {
        if (this.eventMap[event])
            delete this.eventMap[event];
    }
}

module.exports = { Emitter }