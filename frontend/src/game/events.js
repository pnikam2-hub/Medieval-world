// Lightweight pub/sub used to bridge Phaser scene events with React UI.
const listeners = new Map();

export const gameEvents = {
    on(event, cb) {
        if (!listeners.has(event)) listeners.set(event, new Set());
        listeners.get(event).add(cb);
        return () => listeners.get(event)?.delete(cb);
    },
    off(event, cb) {
        listeners.get(event)?.delete(cb);
    },
    emit(event, payload) {
        const set = listeners.get(event);
        if (!set) return;
        set.forEach((cb) => {
            try {
                cb(payload);
            } catch (e) {
                console.error("[gameEvents]", event, e);
            }
        });
    },
    clear() {
        listeners.clear();
    },
};

// Debug hatch: lets automated tests trigger gameEvents without depending on
// Phaser keyboard focus. No effect on regular gameplay since nothing in the
// app polls this; calling it only forwards to gameEvents.emit.
if (typeof window !== "undefined") {
    window.__heartboundEmit = (event, payload) =>
        gameEvents.emit(event, payload);
}

