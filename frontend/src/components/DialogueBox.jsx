import { useEffect } from "react";

export default function DialogueBox({
    open,
    speaker,
    text,
    kind,
    canAdvance,
    onAdvance,
    choices,
    choicePrompt,
    onChoose,
}) {
    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (choices) return; // choices block keyboard advance
            if (e.code === "Space" || e.code === "Enter") {
                e.preventDefault();
                onAdvance?.();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, onAdvance, choices]);

    if (!open) return null;

    return (
        <div
            className="absolute inset-x-0 bottom-0 z-30 px-4 pb-6 md:pb-10 flex flex-col items-center gap-3 pointer-events-none"
            data-testid="dialogue-overlay"
        >
            {choices && (
                <div
                    className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-2 pointer-events-auto"
                    data-testid="dialogue-choices"
                >
                    {choicePrompt && (
                        <p className="md:col-span-2 text-xs uppercase tracking-[0.35em] text-amber-200/80 font-mythic">
                            {choicePrompt}
                        </p>
                    )}
                    {choices.map((c) => {
                        const tagClass =
                            c.tag === "Honesty" || c.tag === "Compassion" || c.tag === "Courage"
                                ? "choice-honesty"
                                : "choice-control";
                        return (
                            <button
                                key={c.id}
                                data-testid={`choice-${c.id}`}
                                className={`choice-card crystal text-left rounded-sm px-4 py-3 border ${tagClass}`}
                                onClick={() => onChoose?.(c)}
                            >
                                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-200/70">
                                    {c.tag}
                                </p>
                                <p className="font-mythic text-lg md:text-xl text-neutral-100 leading-snug">
                                    {c.text}
                                </p>
                            </button>
                        );
                    })}
                </div>
            )}

            <div
                className="w-full max-w-3xl crystal rounded-sm px-5 py-4 md:px-7 md:py-5 pointer-events-auto cursor-pointer animate-reveal"
                data-testid="dialogue-box"
                onClick={() => !choices && onAdvance?.()}
            >
                {speaker ? (
                    <p
                        className="text-[10px] uppercase tracking-[0.35em] text-amber-200/80 font-mythic mb-1"
                        data-testid="dialogue-speaker"
                    >
                        {speaker}
                    </p>
                ) : (
                    <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-1 font-mythic italic">
                        {kind === "narration" ? "narration" : ""}
                    </p>
                )}
                <p
                    key={text}
                    className={`font-mythic ${kind === "narration" ? "italic text-amber-50/90" : "text-neutral-100"} text-lg md:text-xl leading-relaxed animate-type`}
                    data-testid="dialogue-text"
                >
                    {text}
                </p>
                {!choices && canAdvance && (
                    <p className="mt-2 text-[10px] uppercase tracking-[0.35em] text-neutral-500">
                        ▸ Space / Click
                    </p>
                )}
            </div>
        </div>
    );
}
