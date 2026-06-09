import { Eye, BookOpen, Sparkles, Settings as SettingsIcon } from "lucide-react";
import { useGameStore } from "@/game/useGameStore";

export default function HUD({
    chapterTitle,
    chapterId,
    mirrorActive,
    onToggleMirror,
    onOpenJournal,
    onBackToMap,
    onOpenSettings,
    hint,
}) {
    const state = useGameStore();
    const lanternPct = Math.round(state.lantern * 100);

    return (
        <div className="absolute inset-0 z-20 pointer-events-none">
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 flex items-start justify-between p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div
                            className="heart-meter animate-breathe"
                            data-testid="heart-lantern-meter"
                            style={{
                                opacity: 0.4 + state.lantern * 0.6,
                                transform: `scale(${0.85 + state.lantern * 0.25})`,
                            }}
                        >
                            <span className="ring" />
                        </div>
                    </div>
                    <div className="leading-tight">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                            Heart-Lantern
                        </p>
                        <p
                            className="font-mythic text-2xl text-shadow-glow text-amber-100"
                            data-testid="heart-lantern-value"
                        >
                            {lanternPct}%
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                    <button
                        onClick={onToggleMirror}
                        data-testid="mirror-lens-button"
                        className={`crystal px-3 py-2 rounded-sm flex items-center gap-2 text-xs uppercase tracking-[0.25em] transition-all duration-300 ${mirrorActive ? "border-amber-400/70 text-amber-200" : "text-neutral-300 hover:text-amber-200"}`}
                    >
                        <Eye size={14} strokeWidth={1.5} />
                        <span>Mirror</span>
                        <kbd className="text-[10px] text-neutral-500 ml-1">M</kbd>
                    </button>
                    <button
                        onClick={onOpenJournal}
                        data-testid="journal-button"
                        className="crystal px-3 py-2 rounded-sm flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-neutral-300 hover:text-amber-200 transition-all duration-300"
                    >
                        <BookOpen size={14} strokeWidth={1.5} />
                        <span>Journal</span>
                        <kbd className="text-[10px] text-neutral-500 ml-1">J</kbd>
                    </button>
                    <button
                        onClick={onBackToMap}
                        data-testid="back-to-map-button"
                        className="crystal px-3 py-2 rounded-sm flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-neutral-300 hover:text-amber-200 transition-all duration-300"
                    >
                        <Sparkles size={14} strokeWidth={1.5} />
                        <span>Map</span>
                    </button>
                    <button
                        onClick={onOpenSettings}
                        data-testid="settings-button"
                        aria-label="Open settings"
                        className="crystal p-2 rounded-sm text-neutral-400 hover:text-amber-200 transition-all duration-300"
                    >
                        <SettingsIcon size={14} strokeWidth={1.5} />
                    </button>
                </div>
            </div>

            {/* Chapter label */}
            <div className="absolute top-20 left-4 md:left-6">
                <p
                    className="text-[10px] uppercase tracking-[0.4em] text-neutral-500"
                    data-testid="hud-chapter-id"
                >
                    Chapter {chapterId}
                </p>
                <h2
                    className="font-mythic text-2xl md:text-3xl text-neutral-100"
                    data-testid="hud-chapter-title"
                >
                    {chapterTitle}
                </h2>
            </div>

            {/* Hint banner */}
            {hint && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 animate-reveal">
                    <p
                        className="crystal-warm rounded-sm px-4 py-2 text-xs uppercase tracking-[0.3em] text-amber-200"
                        data-testid="hud-hint"
                    >
                        {hint}
                    </p>
                </div>
            )}
        </div>
    );
}
