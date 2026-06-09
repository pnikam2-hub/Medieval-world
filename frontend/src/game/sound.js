// Lightweight Web Audio chime for the Mirror Lens toggle.
// No external assets — synthesized on-the-fly.

let ctx = null;

function getCtx() {
    if (typeof window === "undefined") return null;
    if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
    }
    if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
    }
    return ctx;
}

/**
 * Plays a soft, glassy two-tone chime.
 * @param {"on"|"off"} variant
 */
export function playMirrorChime(variant = "on") {
    const ac = getCtx();
    if (!ac) return;

    const now = ac.currentTime;
    // Slightly different intervals for ON vs OFF for a perceptual shift cue
    const tones = variant === "on" ? [880, 1318.5] : [1318.5, 880]; // A5, E6
    const master = ac.createGain();
    master.gain.value = 0.0;
    master.connect(ac.destination);

    // Gentle attack/decay envelope on master
    master.gain.setValueAtTime(0.0, now);
    master.gain.linearRampToValueAtTime(0.18, now + 0.03);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

    tones.forEach((freq, i) => {
        const osc = ac.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        // Per-oscillator gain for individual fade
        const g = ac.createGain();
        g.gain.value = 0;
        g.gain.setValueAtTime(0, now + i * 0.08);
        g.gain.linearRampToValueAtTime(0.5, now + i * 0.08 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0005, now + i * 0.08 + 0.7);

        osc.connect(g);
        g.connect(master);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.85);
    });

    // Subtle shimmer layer (high partial)
    const shimmer = ac.createOscillator();
    shimmer.type = "triangle";
    shimmer.frequency.setValueAtTime(2637, now); // E7
    const sg = ac.createGain();
    sg.gain.value = 0;
    sg.gain.setValueAtTime(0, now);
    sg.gain.linearRampToValueAtTime(0.05, now + 0.05);
    sg.gain.exponentialRampToValueAtTime(0.0005, now + 1.1);
    shimmer.connect(sg);
    sg.connect(master);
    shimmer.start(now);
    shimmer.stop(now + 1.15);
}
