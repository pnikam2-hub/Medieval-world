import { useEffect } from "react";
import { Sparkles } from "lucide-react";

const ACCENT_HEX = {
    gold: "#fadb5f",
    ember: "#fb8500",
    moon: "#e2e8f0",
};

/**
 * Cinematic chapter-complete overlay. Fades in, plays the celebratory copy,
 * shows any unlocked Heart Quality, then offers a Continue button (or
 * auto-advances after the timeout). Used between gameplay and the journal.
 */
export default function ChapterCompleteOverlay({
    open,
    chapterId,
    chapterTitle,
    endText,
    unlockedQuality,
    accent = "gold",
    onContinue,
}) {
    useEffect(() => {
        if (!open) return undefined;
        const handler = (e) => {
            if (e.code === "Space" || e.code === "Enter") {
                e.preventDefault();
                onContinue?.();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, onContinue]);

    if (!open) return null;
    const accentColor = ACCENT_HEX[accent] || ACCENT_HEX.gold;

    return (
        <div
            className="absolute inset-0 z-[55] flex items-center justify-center px-6"
            data-testid="chapter-complete-overlay"
            style={{
                background:
                    "radial-gradient(ellipse at center, rgba(20,14,4,0.92) 0%, rgba(5,4,4,0.96) 70%)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
            }}
        >
            <div className="max-w-2xl w-full text-center flex flex-col items-center pointer-events-auto">
                {/* Growing lantern */}
                <div className="relative mb-8 animate-reveal" style={{ animationDelay: "100ms" }}>
                    <div
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full animate-breathe"
                        style={{
                            background: `radial-gradient(circle, ${accentColor} 0%, rgba(0,0,0,0) 70%)`,
                            boxShadow: `0 0 60px ${accentColor}, 0 0 120px ${accentColor}55`,
                        }}
                    />
                </div>

                <p
                    className="text-[10px] uppercase tracking-[0.6em] text-amber-200/80 font-mythic animate-reveal"
                    style={{ animationDelay: "350ms" }}
                    data-testid="chapter-complete-eyebrow"
                >
                    Chapter {chapterId} · complete
                </p>
                <h1
                    className="font-mythic text-4xl md:text-6xl text-neutral-50 mt-3 leading-tight animate-reveal"
                    style={{ animationDelay: "600ms" }}
                    data-testid="chapter-complete-title"
                >
                    {chapterTitle}
                </h1>

                {unlockedQuality && (
                    <div
                        className="crystal-warm rounded-sm px-4 py-2 mt-6 flex items-center gap-2 animate-reveal"
                        style={{ animationDelay: "900ms" }}
                        data-testid="chapter-complete-quality"
                    >
                        <Sparkles
                            size={14}
                            strokeWidth={1.5}
                            className="text-amber-200"
                        />
                        <p className="text-[10px] uppercase tracking-[0.35em] text-amber-200">
                            Heart Quality unlocked &middot;{" "}
                            <span className="font-mythic italic normal-case tracking-normal text-base text-amber-100">
                                {unlockedQuality}
                            </span>
                        </p>
                    </div>
                )}

                <p
                    className="font-mythic italic text-lg md:text-2xl text-amber-50/90 mt-8 leading-relaxed max-w-xl animate-reveal"
                    style={{ animationDelay: "1150ms" }}
                    data-testid="chapter-complete-quote"
                >
                    &ldquo;{endText}&rdquo;
                </p>

                <button
                    onClick={onContinue}
                    data-testid="chapter-complete-continue"
                    className="dim-link font-mythic text-xl md:text-2xl text-amber-100 mt-10 animate-reveal"
                    style={{ animationDelay: "1500ms" }}
                >
                    Continue to the journal ▸
                </button>
                <p
                    className="text-[10px] uppercase tracking-[0.35em] text-neutral-500 mt-3 animate-reveal"
                    style={{ animationDelay: "1700ms" }}
                >
                    ▸ Space / Enter
                </p>
            </div>
        </div>
    );
}
