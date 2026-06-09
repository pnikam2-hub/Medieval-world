// Procedural Web Audio soundtrack for Heartbound.
// All sounds connect to a single master GainNode so the mute toggle controls everything.

let ctx = null;
let master = null;
let ambientNodes = null;
let muted = false;
const STORAGE_KEY = "heartbound.audio.muted";

// Read initial mute state from localStorage so user preference survives reload.
try {
    if (typeof window !== "undefined") {
        const v = window.localStorage.getItem(STORAGE_KEY);
        if (v === "true") muted = true;
    }
} catch (e) {
    // ignore
}

function ensure() {
    if (typeof window === "undefined") return null;
    if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = muted ? 0 : 1;
        master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
    }
    return ctx;
}

export function isMuted() {
    return muted;
}

export function setMuted(next) {
    muted = !!next;
    try {
        window.localStorage.setItem(STORAGE_KEY, muted ? "true" : "false");
    } catch (e) {
        // ignore
    }
    if (master && ctx) {
        const now = ctx.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.setTargetAtTime(muted ? 0 : 1, now, 0.08);
    }
}

export function toggleMuted() {
    setMuted(!muted);
    return muted;
}

// ---------------------------------------------------------------------------
// Ambient drone — low warm bed that sits under everything
// ---------------------------------------------------------------------------
export function startAmbient() {
    const ac = ensure();
    if (!ac) return;
    if (ambientNodes) return;

    const bus = ac.createGain();
    bus.gain.value = 0;
    bus.gain.linearRampToValueAtTime(0.05, ac.currentTime + 3.2);
    bus.connect(master);

    // Two sine drones at A1 and A2 — fundamental + first overtone
    const osc1 = ac.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = 55;
    const osc2 = ac.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = 110;

    // Slow LFO for warmth (detunes osc2 slightly)
    const lfo = ac.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.13;
    const lfoG = ac.createGain();
    lfoG.gain.value = 0.6;
    lfo.connect(lfoG);
    lfoG.connect(osc2.detune);

    // Gentle lowpass to take the edge off
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 320;
    filter.Q.value = 0.5;

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(bus);

    osc1.start();
    osc2.start();
    lfo.start();

    ambientNodes = { bus, osc1, osc2, lfo };
}

export function stopAmbient() {
    if (!ambientNodes || !ctx) return;
    const { bus, osc1, osc2, lfo } = ambientNodes;
    const now = ctx.currentTime;
    bus.gain.cancelScheduledValues(now);
    bus.gain.linearRampToValueAtTime(0, now + 1.2);
    setTimeout(() => {
        try {
            osc1.stop();
            osc2.stop();
            lfo.stop();
            bus.disconnect();
        } catch (e) {
            // ignore
        }
    }, 1300);
    ambientNodes = null;
}

// ---------------------------------------------------------------------------
// Heartbeat — two soft thumps used for key moments
// ---------------------------------------------------------------------------
export function playHeartbeat() {
    const ac = ensure();
    if (!ac) return;
    const now = ac.currentTime;
    [0, 0.22].forEach((delay, i) => {
        const osc = ac.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(95, now + delay);
        osc.frequency.exponentialRampToValueAtTime(40, now + delay + 0.18);
        const g = ac.createGain();
        g.gain.value = 0;
        g.gain.setValueAtTime(0, now + delay);
        g.gain.linearRampToValueAtTime(i === 0 ? 0.3 : 0.2, now + delay + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0005, now + delay + 0.32);
        osc.connect(g).connect(master);
        osc.start(now + delay);
        osc.stop(now + delay + 0.36);
    });
}

// ---------------------------------------------------------------------------
// Lantern chime — gentle bell when the Heart-Lantern increases
// ---------------------------------------------------------------------------
export function playLanternChime() {
    const ac = ensure();
    if (!ac) return;
    const now = ac.currentTime;
    // C6 + G6 — perfect fifth, slight inharmonic shimmer
    const tones = [
        { freq: 1046.5, type: "sine", gain: 0.14, decay: 1.3 },
        { freq: 1568.0, type: "triangle", gain: 0.07, decay: 1.2 },
    ];
    tones.forEach((t, i) => {
        const osc = ac.createOscillator();
        osc.type = t.type;
        osc.frequency.value = t.freq;
        const g = ac.createGain();
        const startAt = now + i * 0.04;
        g.gain.value = 0;
        g.gain.setValueAtTime(0, startAt);
        g.gain.linearRampToValueAtTime(t.gain, startAt + 0.025);
        g.gain.exponentialRampToValueAtTime(0.0005, startAt + t.decay);
        osc.connect(g).connect(master);
        osc.start(startAt);
        osc.stop(startAt + t.decay + 0.05);
    });
}

// ---------------------------------------------------------------------------
// Mirror Lens chime — ascending for ON, descending for OFF
// ---------------------------------------------------------------------------
export function playMirrorChime(variant = "on") {
    const ac = ensure();
    if (!ac) return;

    const now = ac.currentTime;
    const tones = variant === "on" ? [880, 1318.5] : [1318.5, 880]; // A5, E6
    const bus = ac.createGain();
    bus.gain.value = 0.0;
    bus.connect(master);
    bus.gain.setValueAtTime(0, now);
    bus.gain.linearRampToValueAtTime(0.16, now + 0.03);
    bus.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

    tones.forEach((freq, i) => {
        const osc = ac.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        const g = ac.createGain();
        g.gain.value = 0;
        g.gain.setValueAtTime(0, now + i * 0.08);
        g.gain.linearRampToValueAtTime(0.5, now + i * 0.08 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0005, now + i * 0.08 + 0.7);

        osc.connect(g);
        g.connect(bus);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.85);
    });

    // High shimmer
    const shimmer = ac.createOscillator();
    shimmer.type = "triangle";
    shimmer.frequency.setValueAtTime(2637, now);
    const sg = ac.createGain();
    sg.gain.value = 0;
    sg.gain.setValueAtTime(0, now);
    sg.gain.linearRampToValueAtTime(0.04, now + 0.05);
    sg.gain.exponentialRampToValueAtTime(0.0005, now + 1.1);
    shimmer.connect(sg);
    sg.connect(bus);
    shimmer.start(now);
    shimmer.stop(now + 1.15);
}
