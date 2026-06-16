const CHAPTER_AMBIENT_LABELS = {
    1: "wasteland",
    2: "wasteland",
    3: "cave",
    4: "road",
    5: "fear",
    6: "road",
    7: "cave",
    8: "road",
    9: "fear",
    10: "road",
    11: "cave",
    12: "inward",
    13: "vastness",
    14: "long-dark",
    15: "courage",
    16: "helpers-return",
    17: "deep-listen",
};

/**
 * Dev-only About / Sound Design section rendered inside the Settings panel.
 * Visible only when isDevMode() is true (gated by the parent panel).
 * Shows the current chapter ambient variant and offers quick chapter jumps.
 */
export default function DevSection({ currentChapterId, onJumpToChapter }) {
    const ambient =
        CHAPTER_AMBIENT_LABELS[currentChapterId] || "default";

    return (
        <div
            className="mt-5 pt-4 border-t border-amber-400/15"
            data-testid="settings-dev-section"
        >
            <p className="text-[10px] uppercase tracking-[0.3em] text-amber-200/70 mb-1">
                About · Sound Design
            </p>
            <p className="text-[11px] text-neutral-400 leading-snug mb-3">
                Procedural Web Audio score &mdash; warm drone, heartbeat,
                chimes &mdash; routed through a single master gain. Current
                chapter ambient:{" "}
                <span
                    className="text-amber-200 font-mythic italic"
                    data-testid="settings-current-ambient"
                >
                    {ambient}
                </span>
            </p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-2">
                Dev · Jump to chapter
            </p>
            <div
                className="grid grid-cols-5 gap-1"
                data-testid="settings-dev-chapter-jump"
            >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((c) => (
                    <button
                        key={c}
                        onClick={() => onJumpToChapter?.(c)}
                        data-testid={`settings-dev-jump-${c}`}
                        aria-pressed={c === currentChapterId}
                        className={`px-2 py-1 rounded-sm border text-[10px] uppercase tracking-[0.15em] transition-colors ${c === currentChapterId ? "border-amber-400/70 text-amber-200" : "border-white/10 text-neutral-400 hover:border-amber-400/40 hover:text-amber-200"}`}
                    >
                        Ch {c}
                    </button>
                ))}
            </div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-600 mt-3 font-mythic italic">
                Dev mode active &middot; visit ?dev=0 to disable
            </p>
        </div>
    );
}
