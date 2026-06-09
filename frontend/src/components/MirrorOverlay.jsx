import { Eye } from "lucide-react";

/**
 * MirrorOverlay renders a clearly visible golden lens treatment on top of
 * the Phaser canvas when the Mirror Lens is active. It also displays a
 * one-time tooltip explaining the mechanic.
 */
export default function MirrorOverlay({ active, showTooltip, onDismissTooltip }) {
    return (
        <>
            {/* Lens overlay — always mounted, opacity toggled for smooth fade */}
            <div
                className={`absolute inset-0 z-[15] pointer-events-none transition-opacity duration-500 ${active ? "opacity-100" : "opacity-0"}`}
                data-testid="mirror-overlay"
                aria-hidden={!active}
            >
                {/* Soft golden vignette */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, rgba(250,219,95,0.10) 0%, rgba(250,219,95,0.04) 40%, rgba(8,6,2,0.55) 100%)",
                    }}
                />
                {/* Outer ring (the lens) */}
                <svg
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%]"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <radialGradient id="lensRing" cx="50%" cy="50%" r="50%">
                            <stop offset="55%" stopColor="rgba(250,219,95,0)" />
                            <stop offset="65%" stopColor="rgba(250,219,95,0.18)" />
                            <stop offset="75%" stopColor="rgba(250,219,95,0)" />
                        </radialGradient>
                    </defs>
                    <rect width="100" height="100" fill="url(#lensRing)" />
                </svg>
                {/* Top corner badge */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full crystal-warm">
                    <Eye size={12} strokeWidth={1.5} className="text-amber-200" />
                    <span className="text-[10px] uppercase tracking-[0.4em] text-amber-200">
                        Mirror Lens · on
                    </span>
                </div>
                {/* Subtle scan-shimmer */}
                <div
                    className="absolute inset-x-0 top-0 h-[2px]"
                    style={{
                        background:
                            "linear-gradient(90deg, transparent, rgba(250,219,95,0.55), transparent)",
                        animation: "mirrorScan 3.2s ease-in-out infinite",
                    }}
                />
            </div>

            {/* First-use tooltip */}
            {showTooltip && (
                <div
                    className="absolute z-[40] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto animate-reveal"
                    data-testid="mirror-tooltip"
                >
                    <div className="crystal-warm rounded-sm px-6 py-5 max-w-sm text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Eye
                                size={14}
                                strokeWidth={1.5}
                                className="text-amber-200"
                            />
                            <p className="text-[10px] uppercase tracking-[0.4em] text-amber-200 font-mythic">
                                Mirror Lens
                            </p>
                        </div>
                        <p className="font-mythic italic text-xl text-amber-50 leading-snug">
                            &ldquo;Mirror Lens reveals what the heart is
                            hiding.&rdquo;
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 mt-3">
                            Press <kbd className="text-amber-200">M</kbd> to toggle
                        </p>
                        <button
                            onClick={onDismissTooltip}
                            data-testid="dismiss-mirror-tooltip"
                            className="dim-link mt-4 text-sm font-mythic"
                        >
                            I understand ▸
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes mirrorScan {
                    0% { transform: translateY(0); opacity: 0; }
                    20% { opacity: 1; }
                    100% { transform: translateY(540px); opacity: 0; }
                }
            `}</style>
        </>
    );
}
