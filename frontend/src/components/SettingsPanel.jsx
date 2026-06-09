import { useEffect, useRef } from "react";
import { Volume2, VolumeX, X } from "lucide-react";
import { isDevMode } from "@/game/devMode";
import DevSection from "@/components/DevSection";

const TEXT_SIZES = [
    { id: "sm", label: "Small" },
    { id: "md", label: "Medium" },
    { id: "lg", label: "Large" },
];

/**
 * Small floating settings panel anchored under the HUD trigger.
 * Contains: mute toggle, volume slider, journal text-size selector.
 * Optionally renders a dev-only <DevSection /> when isDevMode() is true.
 * Dismisses on Escape, click outside, or close button.
 */
export default function SettingsPanel({
    open,
    onClose,
    muted,
    onToggleMute,
    volume,
    onChangeVolume,
    journalTextSize,
    onChangeJournalTextSize,
    currentChapterId,
    onJumpToChapter,
}) {
    const panelRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        const handleKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        const handleClick = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                onClose?.();
            }
        };
        window.addEventListener("keydown", handleKey);
        // Defer the click listener so the opening click doesn't immediately close
        const t = setTimeout(
            () => window.addEventListener("mousedown", handleClick),
            0
        );
        return () => {
            window.removeEventListener("keydown", handleKey);
            window.removeEventListener("mousedown", handleClick);
            clearTimeout(t);
        };
    }, [open, onClose]);

    if (!open) return null;

    const volumePct = Math.round((volume ?? 1) * 100);

    return (
        <div
            ref={panelRef}
            data-testid="settings-panel"
            className="absolute top-16 right-4 md:right-6 z-40 w-[300px] crystal-warm rounded-sm p-4 pointer-events-auto animate-reveal"
            role="dialog"
            aria-label="Settings"
        >
            <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] uppercase tracking-[0.4em] text-amber-200/80 font-mythic">
                    Settings
                </p>
                <button
                    onClick={onClose}
                    data-testid="settings-close-button"
                    aria-label="Close settings"
                    className="text-neutral-400 hover:text-amber-200 transition-colors"
                >
                    <X size={14} strokeWidth={1.5} />
                </button>
            </div>

            {/* Audio */}
            <div className="mb-5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-2">
                    Audio
                </p>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onToggleMute}
                        data-testid="settings-mute-button"
                        aria-label={muted ? "Unmute audio" : "Mute audio"}
                        className={`p-2 rounded-sm border transition-colors ${muted ? "border-neutral-700 text-neutral-500 hover:text-amber-200" : "border-amber-400/40 text-amber-200"}`}
                    >
                        {muted ? (
                            <VolumeX size={16} strokeWidth={1.5} />
                        ) : (
                            <Volume2 size={16} strokeWidth={1.5} />
                        )}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={volumePct}
                        onChange={(e) =>
                            onChangeVolume?.(Number(e.target.value) / 100)
                        }
                        disabled={muted}
                        data-testid="settings-volume-slider"
                        aria-label="Volume"
                        className="flex-1 accent-amber-300 disabled:opacity-40"
                    />
                    <span
                        className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 w-8 text-right"
                        data-testid="settings-volume-value"
                    >
                        {muted ? "—" : `${volumePct}`}
                    </span>
                </div>
            </div>

            {/* Journal text size */}
            <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-2">
                    Journal text size
                </p>
                <div
                    className="grid grid-cols-3 gap-1"
                    data-testid="settings-text-size-group"
                >
                    {TEXT_SIZES.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => onChangeJournalTextSize?.(s.id)}
                            data-testid={`settings-text-size-${s.id}`}
                            aria-pressed={journalTextSize === s.id}
                            className={`px-2 py-2 rounded-sm border text-[11px] uppercase tracking-[0.2em] transition-colors ${journalTextSize === s.id ? "border-amber-400/70 text-amber-200" : "border-white/10 text-neutral-400 hover:border-amber-400/40 hover:text-amber-200"}`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-600 mt-4 font-mythic italic">
                Press Esc or click outside to close
            </p>

            {isDevMode() && (
                <DevSection
                    currentChapterId={currentChapterId}
                    onJumpToChapter={onJumpToChapter}
                />
            )}
        </div>
    );
}
