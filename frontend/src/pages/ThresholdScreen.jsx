import { useNavigate } from "react-router-dom";

export default function ThresholdScreen() {
    const navigate = useNavigate();
    return (
        <div
            className="App vignette grain"
            data-testid="threshold-screen"
            style={{
                background:
                    "radial-gradient(ellipse at center, #221a0c 0%, #0a0908 60%, #050404 100%)",
            }}
        >
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 text-center max-w-3xl mx-auto">
                <div
                    className="heart-meter animate-breathe mb-10"
                    style={{ width: 80, height: 80 }}
                />
                <p
                    className="text-[10px] uppercase tracking-[0.5em] text-amber-200/70 font-mythic animate-reveal"
                    style={{ animationDelay: "100ms" }}
                >
                    First Threshold
                </p>
                <h1
                    className="font-mythic text-4xl md:text-6xl text-neutral-50 mt-4 leading-tight animate-reveal"
                    style={{ animationDelay: "300ms" }}
                >
                    The first threshold has opened.
                </h1>
                <p
                    className="text-neutral-300 text-lg md:text-xl mt-6 leading-relaxed animate-reveal max-w-xl"
                    style={{ animationDelay: "600ms" }}
                >
                    The full journey continues — through courage, helpers,
                    the dragon battle, the return, and the treasure within.
                </p>
                <p
                    className="text-neutral-500 text-sm mt-6 italic font-mythic animate-reveal"
                    style={{ animationDelay: "900ms" }}
                >
                    &ldquo;The world is not asleep. It is waiting for one heart to
                    remember.&rdquo; &mdash; Tara
                </p>

                <div
                    className="flex items-center gap-8 mt-12 animate-reveal"
                    style={{ animationDelay: "1200ms" }}
                >
                    <button
                        className="dim-link font-mythic text-2xl text-amber-100"
                        onClick={() => navigate("/map")}
                        data-testid="threshold-map-button"
                    >
                        Return to the map
                    </button>
                    <button
                        className="dim-link font-mythic text-xl"
                        onClick={() => navigate("/")}
                        data-testid="threshold-title-button"
                    >
                        Title screen
                    </button>
                </div>
            </div>
        </div>
    );
}
