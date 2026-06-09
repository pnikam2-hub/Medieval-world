import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PhaserGame from "@/game/PhaserGame";
import HUD from "@/components/HUD";
import DialogueBox from "@/components/DialogueBox";
import MobileControls from "@/components/MobileControls";
import MirrorOverlay from "@/components/MirrorOverlay";
import {
    CHAPTERS,
    CITIZENS,
    TARA_DIALOGUE,
    SHADOW_DIALOGUE,
    MURAL_DIALOGUE,
    KAVI_DIALOGUE,
} from "@/game/chapters";
import { gameStore, useGameStore } from "@/game/useGameStore";
import { gameEvents } from "@/game/events";


const TARA_CHOICE_BLOCK =
    TARA_DIALOGUE[TARA_DIALOGUE.length - 1].choice;

function buildScript(payload, mirrorOn) {
    if (!payload) return null;
    if (payload.name === "citizen") {
        const c = CITIZENS.find((x) => x.id === payload.npcId);
        if (!c) return null;
        const lines = [
            { speaker: c.label, text: c.surface, kind: "speech" },
            { speaker: "You", text: c.response, kind: "speech" },
        ];
        if (mirrorOn) {
            lines.push({
                speaker: c.label,
                text: `(Beneath the surface: "${c.hidden}")`,
                kind: "speech",
            });
        }
        return lines;
    }
    if (payload.name === "mural-dialogue") return MURAL_DIALOGUE;
    if (payload.name === "tara-dialogue") {
        return [
            ...TARA_DIALOGUE,
            {
                speaker: "Tara",
                text: "Rest now. The road begins at sunrise.",
                kind: "speech",
            },
        ];
    }
    if (payload.name === "kavi-dialogue") return KAVI_DIALOGUE;
    if (payload.name === "shadow-dialogue") {
        return [
            ...SHADOW_DIALOGUE,
            {
                speaker: null,
                text: "(The Shadow Twin steps aside. The fear field stirs awake.)",
                kind: "narration",
            },
        ];
    }
    return null;
}

function useDialogueSequencer() {
    const [open, setOpen] = useState(false);
    const [speaker, setSpeaker] = useState(null);
    const [text, setText] = useState("");
    const [kind, setKind] = useState("speech");
    const [choices, setChoices] = useState(null);
    const [choicePrompt, setChoicePrompt] = useState(null);
    const queueRef = useRef([]);
    const onCloseRef = useRef(null);

    const closeDialogue = useCallback(() => {
        setOpen(false);
        setChoices(null);
        setChoicePrompt(null);
        setText("");
        setSpeaker(null);
        gameEvents.emit("dialogue:done");
        gameEvents.emit("scene:dialogue-lock", false);
        const cb = onCloseRef.current;
        onCloseRef.current = null;
        if (cb) cb();
    }, []);

    const advance = useCallback(() => {
        const queue = queueRef.current;
        if (queue.length === 0) {
            closeDialogue();
            return;
        }
        const next = queue.shift();
        setSpeaker(next.speaker || null);
        setText(next.text);
        setKind(next.kind || "speech");
        if (next.choice) {
            setChoices(next.choice.options);
            setChoicePrompt(next.choice.prompt);
        } else {
            setChoices(null);
            setChoicePrompt(null);
        }
        setOpen(true);
        gameEvents.emit("scene:dialogue-lock", true);
    }, [closeDialogue]);

    const choose = useCallback((option) => {
        if (option.lantern) gameStore.adjustLantern(option.lantern);
        setChoices(null);
        setChoicePrompt(null);
        setSpeaker("Tara");
        setKind("speech");
        setText(option.outcome);

        if (!option.advance) {
            // Re-offer choices on next advance
            queueRef.current.unshift({
                speaker: "Tara",
                text: "Try again. Speak from the honest place.",
                choice: TARA_CHOICE_BLOCK,
            });
        } else {
            gameStore.unlockQuality("truthful-response");
        }
    }, []);

    const enqueue = useCallback(
        (lines, onClose) => {
            queueRef.current = [...lines];
            onCloseRef.current = onClose || null;
            advance();
        },
        [advance]
    );

    return {
        open,
        speaker,
        text,
        kind,
        choices,
        choicePrompt,
        advance,
        choose,
        enqueue,
        canAdvance: !choices,
    };
}

export default function GameScreen() {
    const { chapterId } = useParams();
    const id = parseInt(chapterId, 10) || 1;
    const navigate = useNavigate();
    const state = useGameStore();
    const chapter = useMemo(() => CHAPTERS.find((c) => c.id === id), [id]);

    const [mirrorActive, setMirrorActive] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [hint, setHint] = useState(null);
    const hintTimerRef = useRef(null);
    const mirrorRef = useRef(mirrorActive);
    const completedRef = useRef(false);

    const dialogue = useDialogueSequencer();
    const dialogueRef = useRef(dialogue);
    dialogueRef.current = dialogue;
    mirrorRef.current = mirrorActive;

    // Show first-use Mirror Lens tooltip the first time it is activated
    const handleToggleMirror = () => {
        setMirrorActive((v) => {
            const next = !v;
            if (next && !gameStore.get().mirrorLensTooltipShown) {
                setShowTooltip(true);
            }
            return next;
        });
    };

    const dismissTooltip = () => {
        gameStore.set({ mirrorLensTooltipShown: true });
        setShowTooltip(false);
    };

    // Mount: set current chapter, reset completed flag
    useEffect(() => {
        gameStore.set({ currentChapter: id });
        completedRef.current = false;
    }, [id]);

    // Listen to Phaser-driven events
    useEffect(() => {
        const offOpen = gameEvents.on("dialogue:open", (payload) => {
            dialogueRef.current.enqueue([
                {
                    speaker: payload.speaker,
                    text: payload.text,
                    kind: payload.kind || "speech",
                },
            ]);
        });

        const offScript = gameEvents.on("script:start", (payload) => {
            const lines = buildScript(payload, mirrorRef.current);
            if (!lines || lines.length === 0) return;

            let onClose = null;
            if (payload.name === "tara-dialogue") {
                onClose = () => {
                    setTimeout(() => {
                        const s = gameStore.get();
                        if (
                            s.unlockedQualities.includes("truthful-response") &&
                            !completedRef.current
                        ) {
                            completedRef.current = true;
                            gameEvents.emit("chapter:complete", {
                                chapterId: 3,
                            });
                        }
                    }, 200);
                };
            } else if (payload.name === "shadow-dialogue") {
                onClose = () => {
                    gameEvents.emit("fear:trial-start");
                };
            }
            dialogueRef.current.enqueue(lines, onClose);
        });

        const offComplete = gameEvents.on("chapter:complete", ({ chapterId }) => {
            completedRef.current = true;
            gameStore.completeChapter(chapterId);
            gameStore.adjustLantern(0.18);
            if (chapterId === 5) gameStore.unlockQuality("presence");

            const ch = CHAPTERS.find((c) => c.id === chapterId);
            dialogueRef.current.enqueue(
                [
                    {
                        speaker: null,
                        text: ch.endText,
                        kind: "narration",
                    },
                ],
                () => navigate(`/journal/${chapterId}`)
            );
        });

        const offHint = gameEvents.on("hud:hint", (text) => {
            setHint(text);
            if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
            hintTimerRef.current = setTimeout(() => setHint(null), 4200);
        });

        const offLantern = gameEvents.on("lantern:adjust", (delta) => {
            gameStore.adjustLantern(delta);
        });

        return () => {
            offOpen();
            offScript();
            offComplete();
            offHint();
            offLantern();
            if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
        };
    }, [navigate]);

    // Keyboard: M = mirror, J = journal
    useEffect(() => {
        const handler = (e) => {
            if (e.code === "KeyM") {
                setMirrorActive((v) => {
                    const next = !v;
                    if (next && !gameStore.get().mirrorLensTooltipShown) {
                        setShowTooltip(true);
                    }
                    return next;
                });
            }
            if (e.code === "KeyJ") {
                navigate(`/journal/${id}`);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [id, navigate]);

    if (!chapter) {
        return (
            <div className="App flex items-center justify-center text-neutral-300">
                <p>Chapter not found.</p>
            </div>
        );
    }

    if (!chapter.unlocked) {
        return (
            <div className="App flex items-center justify-center text-neutral-300 flex-col gap-4">
                <p className="font-mythic text-2xl">This stage is not yet open.</p>
                <button
                    className="dim-link font-mythic text-lg"
                    onClick={() => navigate("/map")}
                >
                    ◂ Back to map
                </button>
            </div>
        );
    }

    return (
        <div className="App" data-testid={`game-screen-${id}`}>
            <PhaserGame
                chapterId={id}
                hero={state.hero}
                mirrorActive={mirrorActive}
            />

            <HUD
                chapterTitle={chapter.title}
                chapterId={id}
                mirrorActive={mirrorActive}
                onToggleMirror={handleToggleMirror}
                onOpenJournal={() => navigate(`/journal/${id}`)}
                onBackToMap={() => navigate("/map")}
                hint={hint}
            />

            <MirrorOverlay
                active={mirrorActive}
                showTooltip={showTooltip}
                onDismissTooltip={dismissTooltip}
            />

            <DialogueBox
                open={dialogue.open}
                speaker={dialogue.speaker}
                text={dialogue.text}
                kind={dialogue.kind}
                canAdvance={dialogue.canAdvance}
                choices={dialogue.choices}
                choicePrompt={dialogue.choicePrompt}
                onAdvance={dialogue.advance}
                onChoose={dialogue.choose}
            />

            <MobileControls
                onInteract={() => {
                    const evt = new KeyboardEvent("keydown", { code: "Space" });
                    window.dispatchEvent(evt);
                }}
                onMirror={handleToggleMirror}
                onJournal={() => navigate(`/journal/${id}`)}
            />
        </div>
    );
}
