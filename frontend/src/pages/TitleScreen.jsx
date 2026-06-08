import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/game/useGameStore";

export default function TitleScreen() {
    const navigate = useNavigate();
    const state = useGameStore();

    const hasSave = state.hasSave && state.completedChapters.length > 0;

    return (
        <div className="App vignette grain" data-testid="title-screen">
            {/* Background atmospheric */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(ellipse at 50% 60%, #1c1815 0%, #0a0908 55%, #050404 100%)",
                    }}
                />
                {/* Distant city silhouette */}
                <svg
                    className="absolute bottom-0 left-0 right-0 w-full h-1/2 opacity-50"
                    viewBox="0 0 1200 400"
                    preserveAspectRatio="none"
                >
                    <polygon
                        fill="#0c0c0c"
                        points="0,400 0,260 60,240 90,260 130,230 180,260 220,210 260,240 300,200 350,260 410,180 460,240 510,220 560,260 620,200 670,240 720,180 780,250 830,220 890,260 940,210 1000,240 1060,200 1120,250 1200,220 1200,400"
                    />
                </svg>
                {/* Floating heart-lantern */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[140%]">
                    <div
                        className="heart-meter animate-breathe"
                        style={{ width: 22, height: 22 }}
                    />
                </div>
            </div>

            <div className="relative z-10 flex flex-col items-start justify-center h-full max-w-3xl mx-auto px-8 md:px-16">
                <p
                    className="text-[10px] uppercase tracking-[0.5em] text-amber-200/70 font-mythic mb-4 animate-reveal"
                    style={{ animationDelay: "100ms" }}
                >
                    A mythic adventure
                </p>
                <h1
                    className="font-mythic font-light text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-neutral-50 leading-[0.95] tracking-tight text-shadow-glow animate-reveal"
                    style={{ animationDelay: "200ms" }}
                    data-testid="title-heading"
                >
                    Heartbound
                </h1>
                <h2
                    className="font-mythic italic text-2xl md:text-3xl text-amber-100/80 mt-2 animate-reveal"
                    style={{ animationDelay: "400ms" }}
                >
                    The Hero Within
                </h2>
                <p
                    className="text-base md:text-lg text-neutral-300 max-w-md mt-8 leading-relaxed animate-reveal"
                    style={{ animationDelay: "700ms" }}
                >
                    A mythic journey to remember the light already inside.
                </p>

                <div
                    className="flex flex-col items-start gap-5 mt-12 animate-reveal"
                    style={{ animationDelay: "1000ms" }}
                >
                    <button
                        className="dim-link font-mythic text-2xl md:text-3xl pointer"
                        onClick={() => navigate("/character")}
                        data-testid="start-game-button"
                    >
                        Begin the journey
                    </button>
                    <button
                        className="dim-link font-mythic text-xl md:text-2xl"
                        onClick={() =>
                            hasSave &&
                            navigate(`/game/${state.currentChapter}`)
                        }
                        disabled={!hasSave}
                        aria-disabled={!hasSave}
                        data-testid="continue-button"
                    >
                        Continue
                        {hasSave && (
                            <span className="ml-2 text-xs uppercase tracking-[0.25em] text-neutral-500">
                                · Chapter {state.currentChapter}
                            </span>
                        )}
                    </button>
                    <button
                        className="dim-link font-mythic text-xl md:text-2xl"
                        onClick={() => navigate("/map")}
                        data-testid="chapter-map-button"
                    >
                        Chapter map
                    </button>
                </div>

                <p
                    className="absolute bottom-8 left-8 md:left-16 text-[10px] uppercase tracking-[0.4em] text-neutral-600 font-mythic max-w-md leading-relaxed animate-reveal"
                    style={{ animationDelay: "1400ms" }}
                >
                    &ldquo;The treasure was never outside the hero. The treasure
                    was the awakened heart, already present but forgotten.&rdquo;
                </p>
            </div>
        </div>
    );
}
