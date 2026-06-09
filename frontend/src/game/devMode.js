// Lightweight dev-mode flag. Hidden from normal players.
// Enable by visiting any URL with `?dev=1` once — the flag is then persisted
// to localStorage so subsequent loads stay in dev. Disable by visiting
// `?dev=0` (which clears the flag) or by clearing site data.

const STORAGE_KEY = "heartbound.dev";

function readQueryFlag() {
    if (typeof window === "undefined") return null;
    try {
        const sp = new URLSearchParams(window.location.search);
        if (!sp.has("dev")) return null;
        return sp.get("dev") === "1";
    } catch (e) {
        return null;
    }
}

function readStorageFlag() {
    if (typeof window === "undefined") return false;
    try {
        return window.localStorage.getItem(STORAGE_KEY) === "true";
    } catch (e) {
        return false;
    }
}

// Reconcile query and storage flags once at module load.
let cached = false;
try {
    const q = readQueryFlag();
    if (q === true) {
        window.localStorage.setItem(STORAGE_KEY, "true");
        cached = true;
    } else if (q === false) {
        window.localStorage.removeItem(STORAGE_KEY);
        cached = false;
    } else {
        cached = readStorageFlag();
    }
} catch (e) {
    cached = false;
}

export function isDevMode() {
    return cached;
}
