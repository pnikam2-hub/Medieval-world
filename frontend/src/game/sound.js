// Procedural Web Audio soundtrack for Heartbound.
// All sounds connect to a single master GainNode so the mute toggle controls everything.

let ctx = null;
let master = null;
let ambientNodes = null;
let ambientVariant = null;
let ambientTimers = [];
let muted = false;
let volume = 1.0;
const MUTE_KEY = "heartbound.audio.muted";
const VOL_KEY = "heartbound.audio.volume";

// Read initial mute + volume state from localStorage so user preference survives reload.
try {
    if (typeof window !== "undefined") {
        const m = window.localStorage.getItem(MUTE_KEY);
        if (m === "true") muted = true;
        const v = window.localStorage.getItem(VOL_KEY);
        const parsed = v == null ? null : parseFloat(v);
        if (parsed != null && !Number.isNaN(parsed)) {
            volume = Math.max(0, Math.min(1, parsed));
        }
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
        master.gain.value = muted ? 0 : volume;
        master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
    }
    return ctx;
}

function applyMasterGain() {
    if (!master || !ctx) return;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setTargetAtTime(muted ? 0 : volume, now, 0.08);
}

export function isMuted() {
    return muted;
}

export function setMuted(next) {
    muted = !!next;
    try {
        window.localStorage.setItem(MUTE_KEY, muted ? "true" : "false");
    } catch (e) {
        // ignore
    }
    applyMasterGain();
}

export function toggleMuted() {
    setMuted(!muted);
    return muted;
}

export function getVolume() {
    return volume;
}

export function setVolume(next) {
    const v = Math.max(0, Math.min(1, Number(next) || 0));
    volume = v;
    try {
        window.localStorage.setItem(VOL_KEY, String(v));
    } catch (e) {
        // ignore
    }
    applyMasterGain();
}

// ---------------------------------------------------------------------------
// Ambient drone — variant-aware
// ---------------------------------------------------------------------------
function _makeWind(ac, targetBus) {
    // White-noise wind, bandpass-filtered, LFO-modulated centre frequency
    const buffer = ac.createBuffer(1, ac.sampleRate * 4, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const source = ac.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ac.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 600;
    filter.Q.value = 0.7;

    const lfo = ac.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.18;
    const lfoG = ac.createGain();
    lfoG.gain.value = 320;
    lfo.connect(lfoG);
    lfoG.connect(filter.frequency);

    const g = ac.createGain();
    g.gain.value = 0;
    g.gain.linearRampToValueAtTime(0.045, ac.currentTime + 4);

    source.connect(filter);
    filter.connect(g);
    g.connect(targetBus);

    source.start();
    lfo.start();
    return { source, lfo };
}

function _caveChime() {
    const ac = ensure();
    if (!ac) return;
    const now = ac.currentTime;
    const pool = [659.25, 783.99, 1046.5, 1318.5]; // E5, G5, C6, E6
    const freq = pool[Math.floor(Math.random() * pool.length)];
    const osc = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const g = ac.createGain();
    g.gain.value = 0;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.05, now + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0005, now + 2.8);
    osc.connect(g).connect(master);
    osc.start(now);
    osc.stop(now + 2.9);
}

function _roadChime() {
    const ac = ensure();
    if (!ac) return;
    const now = ac.currentTime;
    // Two soft tones — a distant traveling-bell feel (A4 + E5)
    const tones = [440, 659.25];
    tones.forEach((freq, i) => {
        const osc = ac.createOscillator();
        osc.type = "triangle";
        osc.frequency.value = freq;
        const g = ac.createGain();
        const startAt = now + i * 0.18;
        g.gain.value = 0;
        g.gain.setValueAtTime(0, startAt);
        g.gain.linearRampToValueAtTime(0.035, startAt + 0.06);
        g.gain.exponentialRampToValueAtTime(0.0005, startAt + 2.2);
        osc.connect(g).connect(master);
        osc.start(startAt);
        osc.stop(startAt + 2.3);
    });
}

function _stopAmbientInternal() {
    if (!ambientNodes || !ctx) return;
    const { bus, oscs, wind } = ambientNodes;
    const now = ctx.currentTime;
    bus.gain.cancelScheduledValues(now);
    bus.gain.linearRampToValueAtTime(0, now + 1.2);

    ambientTimers.forEach((t) => clearInterval(t));
    ambientTimers = [];

    const captured = { bus, oscs, wind };
    setTimeout(() => {
        try {
            captured.oscs.forEach((o) => o.stop());
            if (captured.wind) {
                captured.wind.source.stop();
                captured.wind.lfo.stop();
            }
            captured.bus.disconnect();
        } catch (e) {
            // ignore
        }
    }, 1300);
    ambientNodes = null;
    ambientVariant = null;
}

/**
 * Starts the ambient bed for the given chapter variant.
 * Variants: "default" | "cave" | "fear". No-op if already running with same variant.
 */
export function startAmbient(variant = "default") {
    const ac = ensure();
    if (!ac) return;
    if (ambientNodes && ambientVariant === variant) return;
    if (ambientNodes) _stopAmbientInternal();
    ambientVariant = variant;

    const bus = ac.createGain();
    bus.gain.value = 0;
    bus.connect(master);
    const oscs = [];

    if (variant === "cave") {
        // Warmer, resonant cave bed — C2 fundamental + perfect fifth shimmer
        const filter = ac.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 520;
        filter.Q.value = 1.4;

        const o1 = ac.createOscillator();
        o1.type = "sine";
        o1.frequency.value = 65.4; // C2
        const o2 = ac.createOscillator();
        o2.type = "sine";
        o2.frequency.value = 130.8; // C3
        const o3 = ac.createOscillator();
        o3.type = "triangle";
        o3.frequency.value = 196.0; // G3 — perfect fifth
        const o3g = ac.createGain();
        o3g.gain.value = 0.35;
        o3.connect(o3g);
        o3g.connect(filter);
        o1.connect(filter);
        o2.connect(filter);
        filter.connect(bus);
        bus.gain.linearRampToValueAtTime(0.07, ac.currentTime + 3);
        o1.start();
        o2.start();
        o3.start();
        oscs.push(o1, o2, o3);

        // Sparse cave chimes every 9–14s
        const scheduleChime = () => {
            _caveChime();
        };
        ambientTimers.push(
            setInterval(scheduleChime, 9000 + Math.random() * 5000)
        );

        ambientNodes = { bus, oscs };
    } else if (variant === "fear") {
        // Colder, lower bed — E1 fundamental + dissonant sawtooth + wind
        const filter = ac.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 220;
        filter.Q.value = 0.4;

        const o1 = ac.createOscillator();
        o1.type = "sine";
        o1.frequency.value = 41.2; // E1
        const o2 = ac.createOscillator();
        o2.type = "sawtooth";
        o2.frequency.value = 82.4;
        const o2g = ac.createGain();
        o2g.gain.value = 0.05;
        o2.connect(o2g);
        o2g.connect(filter);
        o1.connect(filter);
        filter.connect(bus);

        const wind = _makeWind(ac, bus);

        bus.gain.linearRampToValueAtTime(0.06, ac.currentTime + 3);
        o1.start();
        o2.start();
        oscs.push(o1, o2);

        // Sparse heartbeat every 7–12s
        ambientTimers.push(
            setInterval(() => playHeartbeat(), 7000 + Math.random() * 5000)
        );

        ambientNodes = { bus, oscs, wind };
    } else {
        // Default warm bed — A1 + A2 + slow LFO
        const filter = ac.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 320;
        filter.Q.value = 0.5;

        const o1 = ac.createOscillator();
        o1.type = "sine";
        o1.frequency.value = 55;
        const o2 = ac.createOscillator();
        o2.type = "sine";
        o2.frequency.value = 110;
        const lfo = ac.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 0.13;
        const lfoG = ac.createGain();
        lfoG.gain.value = 0.6;
        lfo.connect(lfoG);
        lfoG.connect(o2.detune);

        o1.connect(filter);
        o2.connect(filter);
        filter.connect(bus);
        bus.gain.linearRampToValueAtTime(0.05, ac.currentTime + 3.2);
        o1.start();
        o2.start();
        lfo.start();
        oscs.push(o1, o2, lfo);
        ambientNodes = { bus, oscs };
    }
}

export function stopAmbient() {
    _stopAmbientInternal();
}

// ---------------------------------------------------------------------------
// Heartbeat — two soft thumps used for key moments
// ---------------------------------------------------------------------------
export function playHeartbeat(intensity = 1) {
    const ac = ensure();
    if (!ac) return;
    const now = ac.currentTime;
    const scale = Math.max(0.1, Math.min(1, intensity));
    [0, 0.22].forEach((delay, i) => {
        const osc = ac.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(95, now + delay);
        osc.frequency.exponentialRampToValueAtTime(40, now + delay + 0.18);
        const g = ac.createGain();
        g.gain.value = 0;
        g.gain.setValueAtTime(0, now + delay);
        g.gain.linearRampToValueAtTime(
            (i === 0 ? 0.3 : 0.2) * scale,
            now + delay + 0.015
        );
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
    const tones = variant === "on" ? [880, 1318.5] : [1318.5, 880];
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
