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
