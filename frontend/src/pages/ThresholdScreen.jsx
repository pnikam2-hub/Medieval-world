import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/game/useGameStore";

// Lazy-load the SVG/Canvas-heavy card so the title-screen bundle stays light.
const ThresholdCard = lazy(() =>
    import("@/components/ThresholdCard")
);

const THRESHOLD_QUOTE =
    "The first victory is not fear disappearing. It is you no longer disappearing inside fear.";

function CardFallback() {
    return (
        <div
            data-testid="threshold-card-fallback"
            className="flex flex-col items-center gap-6"
        >
            <div
                className="rounded-sm border border-amber-400/20 crystal-warm flex items-center justify-center"
                style={{
                    width: "min(420px, 80vw)",
                    aspectRatio: "1080/1350",
                }}
            >
                <p className="text-[10px] uppercase tracking-[0.4em] text-amber-200/60 font-mythic animate-ember">
                    rendering threshold
                </p>
            </div>
        </div>
    );
}

export default function ThresholdScreen() {
    const navigate = useNavigate();
    const state = useGameStore();
    const heroName = state.hero?.name || "Arin";
    const accent = state.hero?.accent || "gold";

    return (
        <div
            className="App vignette grain overflow-auto"
            data-testid="threshold-screen"
            style={{
                background:
                    "radial-gradient(ellipse at center, #221a0c 0%, #0a0908 60%, #050404 100%)",
            }}
        >
            <div className="relative z-10 min-h-full flex flex-col items-center px-6 py-10 md:py-16 text-center max-w-5xl mx-auto">
                <p
                    className="text-[10px] uppercase tracking-[0.5em] text-amber-200/70 font-mythic animate-reveal"
                    style={{ animationDelay: "100ms" }}
                >
                    First Threshold
                </p>
                <h1
                    className="font-mythic text-3xl md:text-5xl text-neutral-50 mt-3 leading-tight animate-reveal"
                    style={{ animationDelay: "300ms" }}
                >
                    The first threshold has opened.
                </h1>
                <p
                    className="text-neutral-300 text-base md:text-lg mt-4 leading-relaxed animate-reveal max-w-xl"
                    style={{ animationDelay: "600ms" }}
                >
                    The full journey continues &mdash; through courage, helpers,
                    the dragon battle, the return, and the treasure within.
                </p>

                <div
                    className="mt-10 animate-reveal"
                    style={{ animationDelay: "900ms" }}
                >
                    <Suspense fallback={<CardFallback />}>
                        <ThresholdCard
                            heroName={heroName}
                            accent={accent}
                            quote={THRESHOLD_QUOTE}
                        />
                    </Suspense>
                </div>

                <div
                    className="flex items-center gap-8 mt-10 animate-reveal"
                    style={{ animationDelay: "1200ms" }}
                >
                    <button
                        className="dim-link font-mythic text-xl md:text-2xl text-amber-100"
                        onClick={() => navigate("/map")}
                        data-testid="threshold-map-button"
                    >
                        Return to the map
                    </button>
                    <button
                        className="dim-link font-mythic text-lg md:text-xl"
                        onClick={() => navigate("/")}
                        data-testid="threshold-title-button"
                    >
                        Title screen
                    </button>
                </div>

                <p
                    className="text-neutral-500 text-xs md:text-sm mt-10 italic font-mythic animate-reveal max-w-md"
                    style={{ animationDelay: "1500ms" }}
                >
                    &ldquo;The world is not asleep. It is waiting for one heart
                    to remember.&rdquo; &mdash; Tara
                </p>
            </div>
        </div>
    );
}
