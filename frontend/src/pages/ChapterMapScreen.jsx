import { useNavigate } from "react-router-dom";
import { CHAPTERS } from "@/game/chapters";
import { useGameStore } from "@/game/useGameStore";
import { Lock } from "lucide-react";

export default function ChapterMapScreen() {
    const navigate = useNavigate();
    const state = useGameStore();
    const completed = new Set(state.completedChapters);

    // Spiral coordinates for 23 stages on a 1100x720 viewBox
    // Generated via a logarithmic spiral, then hand-tuned.
    const cx = 550;
    const cy = 360;
    const positions = CHAPTERS.map((_, i) => {
        const t = i / (CHAPTERS.length - 1);
        const angle = t * Math.PI * 4.4 - Math.PI / 2;
        const radius = 90 + t * 290;
        return {
            x: cx + Math.cos(angle) * radius,
            y: cy + Math.sin(angle) * radius * 0.7,
        };
    });

    return (
        <div
            className="App vignette grain"
            data-testid="chapter-map-screen"
            style={{
                background:
                    "radial-gradient(ellipse at 50% 50%, #1a1614 0%, #060606 65%)",
            }}
        >
            <div className="absolute top-0 left-0 right-0 p-6 md:p-10 flex items-start justify-between z-20">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-amber-200/70 font-mythic">
                        Antara · The Inner Space
                    </p>
                    <h1 className="font-mythic text-3xl md:text-5xl text-neutral-50 mt-1">
                        The Hero Journey
                    </h1>
                    <p className="text-neutral-500 text-xs md:text-sm mt-1">
                        Twenty-three stages. Eleven open. Twelve
                        waiting.
                    </p>
                </div>
                <button
                    className="dim-link font-mythic text-xl"
                    onClick={() => navigate("/")}
                    data-testid="map-back-button"
                >
                    ◂ Title
                </button>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pt-20 md:pt-24">
                <svg
                    viewBox="0 0 1100 720"
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Spiral path */}
                    <path
                        d={positions
                            .map(
                                (p, i) =>
                                    `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`
                            )
                            .join(" ")}
                        fill="none"
                        stroke="rgba(212,175,55,0.18)"
                        strokeWidth="1"
                        strokeDasharray="2 6"
                    />

                    {positions.map((p, i) => {
                        const ch = CHAPTERS[i];
                        const isUnlocked = ch.unlocked;
                        const isCompleted = completed.has(ch.id);
                        const isCurrent =
                            isUnlocked && ch.id === state.currentChapter;
                        const fill = isCompleted
                            ? "#fadb5f"
                            : isUnlocked
                              ? "#d4af37"
                              : "#3a3a3a";
                        return (
                            <g
                                key={ch.id}
                                onClick={() =>
                                    isUnlocked && navigate(`/game/${ch.id}`)
                                }
                                style={{
                                    cursor: isUnlocked ? "pointer" : "default",
                                }}
                                data-testid={`map-node-${ch.id}`}
                            >
                                {isCurrent && (
                                    <circle
                                        cx={p.x}
                                        cy={p.y}
                                        r="18"
                                        fill="none"
                                        stroke="#fadb5f"
                                        strokeWidth="1"
                                        opacity="0.5"
                                    >
                                        <animate
                                            attributeName="r"
                                            from="14"
                                            to="28"
                                            dur="2.2s"
                                            repeatCount="indefinite"
                                        />
                                        <animate
                                            attributeName="opacity"
                                            from="0.7"
                                            to="0"
                                            dur="2.2s"
                                            repeatCount="indefinite"
                                        />
                                    </circle>
                                )}
                                <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r={isUnlocked ? 9 : 6}
                                    fill={fill}
                                    opacity={isUnlocked ? 1 : 0.5}
                                    style={{
                                        filter: isUnlocked
                                            ? `drop-shadow(0 0 8px ${fill})`
                                            : "none",
                                    }}
                                />
                                <text
                                    x={p.x}
                                    y={p.y - 16}
                                    textAnchor="middle"
                                    fontFamily="Cormorant Garamond, serif"
                                    fontSize="13"
                                    fill={
                                        isUnlocked
                                            ? "#f5f5f5"
                                            : "#737373"
                                    }
                                >
                                    {ch.id}. {ch.title}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Chapter list overlay (right side) */}
            <div className="absolute bottom-0 left-0 right-0 z-10 pb-6 md:pb-8 px-6 md:px-10">
                <div className="overflow-x-auto scroll-hide -mx-2 px-2">
                    <div className="flex gap-3 min-w-min">
                        {CHAPTERS.map((ch) => {
                            const unlocked = ch.unlocked;
                            const isCompleted = completed.has(ch.id);
                            return (
                                <button
                                    key={ch.id}
                                    onClick={() =>
                                        unlocked && navigate(`/game/${ch.id}`)
                                    }
                                    disabled={!unlocked}
                                    data-testid={`map-card-${ch.id}`}
                                    className={`crystal text-left rounded-sm border min-w-[220px] max-w-[240px] px-4 py-3 transition-all duration-300 ${unlocked ? "border-amber-400/30 hover:border-amber-400/70 cursor-pointer" : "border-white/5 opacity-60 cursor-not-allowed"}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] uppercase tracking-[0.3em] text-amber-200/70 font-mythic">
                                            {String(ch.id).padStart(2, "0")}
                                        </span>
                                        {!unlocked && (
                                            <Lock
                                                size={12}
                                                strokeWidth={1.5}
                                                className="text-neutral-500"
                                            />
                                        )}
                                        {isCompleted && (
                                            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-300/90">
                                                Remembered
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-mythic text-xl text-neutral-100 mt-1">
                                        {ch.title}
                                    </h3>
                                    <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 mt-1 leading-snug">
                                        {ch.subtitle}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
