import { useRef, useState } from "react";
import { Download, Share2, Check } from "lucide-react";

const ACCENTS = {
    gold: { hex: "#fadb5f", soft: "#d4af37", name: "Gold" },
    ember: { hex: "#fb8500", soft: "#c2410c", name: "Ember" },
    moon: { hex: "#e2e8f0", soft: "#94a3b8", name: "Moonlight" },
};

const W = 1080;
const H = 1350;

/**
 * Renders a portrait Threshold card with the hero's name, lantern accent,
 * and the closing quote. Provides Download (PNG) + Share (native share API
 * with PNG fallback to download) buttons.
 */
export default function ThresholdCard({ heroName, accent = "gold", quote }) {
    const svgRef = useRef(null);
    const [shareState, setShareState] = useState("idle"); // idle | working | done

    const palette = ACCENTS[accent] || ACCENTS.gold;
    const safeName = (heroName || "Hero").slice(0, 22);

    const renderSvgString = () => {
        const node = svgRef.current;
        if (!node) return null;
        // Serialize and ensure xmlns is present
        const clone = node.cloneNode(true);
        clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        return new XMLSerializer().serializeToString(clone);
    };

    const svgToPngBlob = () =>
        new Promise((resolve, reject) => {
            const svgStr = renderSvgString();
            if (!svgStr) return reject(new Error("no svg"));
            const svgBlob = new Blob([svgStr], {
                type: "image/svg+xml;charset=utf-8",
            });
            const url = URL.createObjectURL(svgBlob);
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = W;
                canvas.height = H;
                const ctx = canvas.getContext("2d");
                ctx.fillStyle = "#080606";
                ctx.fillRect(0, 0, W, H);
                ctx.drawImage(img, 0, 0, W, H);
                URL.revokeObjectURL(url);
                canvas.toBlob((blob) => {
                    if (!blob) reject(new Error("toBlob failed"));
                    else resolve(blob);
                }, "image/png");
            };
            img.onerror = (e) => {
                URL.revokeObjectURL(url);
                reject(e);
            };
            img.src = url;
        });

    const download = async () => {
        try {
            setShareState("working");
            const blob = await svgToPngBlob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `heartbound-threshold-${safeName.toLowerCase().replace(/\s+/g, "-")}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setShareState("done");
            setTimeout(() => setShareState("idle"), 1800);
        } catch (e) {
            setShareState("idle");
        }
    };

    const share = async () => {
        try {
            setShareState("working");
            const blob = await svgToPngBlob();
            const file = new File([blob], "heartbound-threshold.png", {
                type: "image/png",
            });
            if (
                typeof navigator !== "undefined" &&
                navigator.canShare &&
                navigator.canShare({ files: [file] })
            ) {
                await navigator.share({
                    files: [file],
                    title: "Heartbound — first threshold",
                    text: `${safeName} crossed the first threshold of Heartbound. The treasure was never outside the hero.`,
                });
                setShareState("done");
                setTimeout(() => setShareState("idle"), 1800);
                return;
            }
            // Fallback: download
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "heartbound-threshold.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setShareState("done");
            setTimeout(() => setShareState("idle"), 1800);
        } catch (e) {
            setShareState("idle");
        }
    };

    return (
        <div
            className="flex flex-col items-center gap-6"
            data-testid="threshold-card"
        >
            {/* Visual card */}
            <div
                className="relative rounded-sm overflow-hidden shadow-[0_20px_80px_rgba(212,175,55,0.15)] border border-amber-400/20"
                style={{ width: "min(420px, 80vw)", aspectRatio: `${W}/${H}` }}
            >
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${W} ${H}`}
                    width="100%"
                    height="100%"
                    xmlns="http://www.w3.org/2000/svg"
                    data-testid="threshold-card-svg"
                    style={{ display: "block" }}
                >
                    <defs>
                        <radialGradient id="bg" cx="50%" cy="55%" r="65%">
                            <stop offset="0%" stopColor="#1a1410" />
                            <stop offset="55%" stopColor="#0a0807" />
                            <stop offset="100%" stopColor="#050404" />
                        </radialGradient>
                        <radialGradient id="lantern" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={palette.hex} stopOpacity="1" />
                            <stop offset="40%" stopColor={palette.hex} stopOpacity="0.35" />
                            <stop offset="100%" stopColor={palette.hex} stopOpacity="0" />
                        </radialGradient>
                        <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor={palette.hex} stopOpacity="0" />
                            <stop offset="50%" stopColor={palette.hex} stopOpacity="0.7" />
                            <stop offset="100%" stopColor={palette.hex} stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Background */}
                    <rect width={W} height={H} fill="url(#bg)" />

                    {/* Distant city silhouette */}
                    <path
                        d={`M0 ${H - 220} L60 ${H - 260} L120 ${H - 240} L180 ${H - 290} L260 ${H - 250} L340 ${H - 310} L420 ${H - 260} L500 ${H - 320} L580 ${H - 270} L660 ${H - 330} L740 ${H - 280} L820 ${H - 320} L900 ${H - 260} L980 ${H - 300} L${W} ${H - 250} L${W} ${H} L0 ${H} Z`}
                        fill="#0c0a08"
                        opacity="0.8"
                    />

                    {/* Lantern glow centerpiece */}
                    <circle cx={W / 2} cy={H / 2 - 60} r="320" fill="url(#lantern)" />
                    <circle
                        cx={W / 2}
                        cy={H / 2 - 60}
                        r="42"
                        fill={palette.hex}
                        opacity="0.95"
                    />
                    <circle
                        cx={W / 2}
                        cy={H / 2 - 60}
                        r="22"
                        fill="#fff"
                        opacity="0.6"
                    />

                    {/* Top metadata */}
                    <text
                        x={W / 2}
                        y={140}
                        textAnchor="middle"
                        fontFamily="Outfit, sans-serif"
                        fontSize="22"
                        letterSpacing="14"
                        fill={palette.hex}
                        opacity="0.85"
                    >
                        HEARTBOUND
                    </text>
                    <text
                        x={W / 2}
                        y={186}
                        textAnchor="middle"
                        fontFamily="Cormorant Garamond, serif"
                        fontStyle="italic"
                        fontSize="28"
                        fill="#d4d4d4"
                        opacity="0.7"
                    >
                        the hero within
                    </text>

                    {/* Horizontal rule */}
                    <rect x={W / 2 - 200} y={230} width="400" height="1" fill="url(#rule)" />

                    {/* Chapter banner */}
                    <text
                        x={W / 2}
                        y={950}
                        textAnchor="middle"
                        fontFamily="Outfit, sans-serif"
                        fontSize="20"
                        letterSpacing="12"
                        fill="#fafafa"
                        opacity="0.8"
                    >
                        CHAPTER V · FEAR
                    </text>
                    <text
                        x={W / 2}
                        y={1010}
                        textAnchor="middle"
                        fontFamily="Cormorant Garamond, serif"
                        fontSize="58"
                        fontWeight="300"
                        fill="#fafafa"
                    >
                        First threshold crossed
                    </text>

                    {/* Hero line */}
                    <text
                        x={W / 2}
                        y={1080}
                        textAnchor="middle"
                        fontFamily="Cormorant Garamond, serif"
                        fontStyle="italic"
                        fontSize="34"
                        fill={palette.hex}
                    >
                        for {safeName}
                    </text>

                    {/* Quote */}
                    <foreignObject x={120} y={1130} width={W - 240} height={140}>
                        <div
                            xmlns="http://www.w3.org/1999/xhtml"
                            style={{
                                fontFamily: "Cormorant Garamond, serif",
                                fontStyle: "italic",
                                fontSize: "30px",
                                color: "#e5e5e5",
                                textAlign: "center",
                                lineHeight: 1.35,
                                opacity: 0.92,
                            }}
                        >
                            &ldquo;{quote}&rdquo;
                        </div>
                    </foreignObject>

                    {/* Footer mark */}
                    <text
                        x={W / 2}
                        y={H - 50}
                        textAnchor="middle"
                        fontFamily="Outfit, sans-serif"
                        fontSize="14"
                        letterSpacing="8"
                        fill="#737373"
                        opacity="0.7"
                    >
                        ANTARA · {palette.name.toUpperCase()} LANTERN
                    </text>
                </svg>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3" data-testid="threshold-card-actions">
                <button
                    onClick={download}
                    disabled={shareState === "working"}
                    data-testid="threshold-download-button"
                    className="crystal-warm rounded-sm px-4 py-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-amber-200 hover:text-amber-100 transition-all duration-300 disabled:opacity-60"
                >
                    {shareState === "done" ? (
                        <Check size={14} strokeWidth={1.5} />
                    ) : (
                        <Download size={14} strokeWidth={1.5} />
                    )}
                    <span>
                        {shareState === "done"
                            ? "Saved"
                            : shareState === "working"
                              ? "Rendering"
                              : "Download PNG"}
                    </span>
                </button>
                <button
                    onClick={share}
                    disabled={shareState === "working"}
                    data-testid="threshold-share-button"
                    className="crystal rounded-sm px-4 py-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-neutral-300 hover:text-amber-200 transition-all duration-300 disabled:opacity-60"
                >
                    <Share2 size={14} strokeWidth={1.5} />
                    <span>Share</span>
                </button>
            </div>
        </div>
    );
}
