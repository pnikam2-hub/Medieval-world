import { useCallback } from "react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkle } from "lucide-react";
import { gameEvents } from "@/game/events";

function PadButton({ testId, onDown, onUp, label, children }) {
    const handleStart = useCallback(
        (e) => {
            e.preventDefault();
            onDown?.();
        },
        [onDown]
    );
    const handleEnd = useCallback(
        (e) => {
            e.preventDefault();
            onUp?.();
        },
        [onUp]
    );
    return (
        <button
            data-testid={testId}
            aria-label={label}
            className="mobile-pad-btn"
            onTouchStart={handleStart}
            onTouchEnd={handleEnd}
            onTouchCancel={handleEnd}
            onMouseDown={handleStart}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
        >
            {children}
        </button>
    );
}

export default function MobileControls({ onInteract, onMirror, onJournal }) {
    const send = (k, v) => gameEvents.emit("input:mobile", { [k]: v });

    return (
        <div className="md:hidden absolute inset-x-0 bottom-0 z-30 px-4 pb-4 flex items-end justify-between pointer-events-none">
            <div className="grid grid-cols-3 gap-1 pointer-events-auto">
                <span />
                <PadButton
                    testId="mobile-up"
                    label="Up"
                    onDown={() => send("up", true)}
                    onUp={() => send("up", false)}
                >
                    <ArrowUp size={20} strokeWidth={1.5} />
                </PadButton>
                <span />
                <PadButton
                    testId="mobile-left"
                    label="Left"
                    onDown={() => send("left", true)}
                    onUp={() => send("left", false)}
                >
                    <ArrowLeft size={20} strokeWidth={1.5} />
                </PadButton>
                <PadButton
                    testId="mobile-down"
                    label="Down"
                    onDown={() => send("down", true)}
                    onUp={() => send("down", false)}
                >
                    <ArrowDown size={20} strokeWidth={1.5} />
                </PadButton>
                <PadButton
                    testId="mobile-right"
                    label="Right"
                    onDown={() => send("right", true)}
                    onUp={() => send("right", false)}
                >
                    <ArrowRight size={20} strokeWidth={1.5} />
                </PadButton>
            </div>
            <div className="flex flex-col gap-2 pointer-events-auto">
                <button
                    data-testid="mobile-interact"
                    onClick={onInteract}
                    className="mobile-pad-btn"
                    aria-label="Interact"
                >
                    <Sparkle size={20} strokeWidth={1.5} />
                </button>
                <button
                    data-testid="mobile-mirror"
                    onClick={onMirror}
                    className="mobile-pad-btn text-amber-200 text-[10px] uppercase tracking-wider"
                    aria-label="Mirror"
                >
                    M
                </button>
                <button
                    data-testid="mobile-journal"
                    onClick={onJournal}
                    className="mobile-pad-btn text-amber-200 text-[10px] uppercase tracking-wider"
                    aria-label="Journal"
                >
                    J
                </button>
            </div>
        </div>
    );
}
