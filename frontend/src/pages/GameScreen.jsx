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
import { playMirrorChime } from "@/game/sound";

// Speaker name -> hidden emotional truth revealed under Mirror Lens
const SPEAKER_HIDDEN_LABELS = {
    Tara: "Myth keeper",
    "Mural Voice": "A door, a memory",
    "Shadow Twin": "Wounded, protective self",
    Kavi: "Loyal companion",
};


const TARA_CHOICE_BLOCK =
    TARA_DIALOGUE[TARA_DIALOGUE.length - 1].choice;

function buildScript(payload) {
    if (!payload) return null;
    if (payload.name === "citizen") {
        const c = CITIZENS.find((x) => x.id === payload.npcId);
        if (!c) return null;
        return [
            {
                speaker: c.label,
                hiddenLabel: c.hiddenLabel,
                text: c.surface,
                kind: "speech",
            },
            { speaker: "You", text: c.response, kind: "speech" },
            {
                speaker: c.label,
                hiddenLabel: c.hiddenLabel,
                text: `(Beneath the surface) ${c.hidden}`,
                kind: "speech",
                mirrorOnly: true,
            },
        ];
    }
    if (payload.name === "mural-dialogue") {
        return MURAL_DIALOGUE.map((line) => ({
            ...line,
            hiddenLabel:
                line.speaker && SPEAKER_HIDDEN_LABELS[line.speaker]
                    ? SPEAKER_HIDDEN_LABELS[line.speaker]
                    : line.hiddenLabel,
        }));
    }
    if (payload.name === "tara-dialogue") {
        return [
            ...TARA_DIALOGUE,
            {
                speaker: "Tara",
                text: "Rest now. The road begins at sunrise.",
                kind: "speech",
            },
        ].map((line) => ({
            ...line,
            hiddenLabel:
                line.speaker && SPEAKER_HIDDEN_LABELS[line.speaker]
                    ? SPEAKER_HIDDEN_LABELS[line.speaker]
                    : line.hiddenLabel,
        }));
    }
    if (payload.name === "kavi-dialogue") {
        return KAVI_DIALOGUE.map((line) => ({
            ...line,
            hiddenLabel:
                line.speaker && SPEAKER_HIDDEN_LABELS[line.speaker]
                    ? SPEAKER_HIDDEN_LABELS[line.speaker]
                    : line.hiddenLabel,
        }));
    }
    if (payload.name === "shadow-dialogue") {
        return [
            ...SHADOW_DIALOGUE,
            {
                speaker: null,
                text: "(The Shadow Twin steps aside. The fear field stirs awake.)",
                kind: "narration",
            },
        ].map((line) => ({
            ...line,
            hiddenLabel:
                line.speaker && SPEAKER_HIDDEN_LABELS[line.speaker]
                    ? SPEAKER_HIDDEN_LABELS[line.speaker]
                    : line.hiddenLabel,
        }));
    }
    return null;
}

function useDialogueSequencer() {
    const [open, setOpen] = useState(false);
    const [speaker, setSpeaker] = useState(null);
    const [hiddenLabel, setHiddenLabel] = useState(null);
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
        setHiddenLabel(null);
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
        setHiddenLabel(next.hiddenLabel || null);
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
        setHiddenLabel(SPEAKER_HIDDEN_LABELS.Tara);
        setKind("speech");
        setText(option.outcome);

        if (!option.advance) {
            // Re-offer choices on next advance
            queueRef.current.unshift({
                speaker: "Tara",
                hiddenLabel: SPEAKER_HIDDEN_LABELS.Tara,
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
        hiddenLabel,
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

    // Show first-use Mirror Lens tooltip the first time it is activated.
    // Single source of truth used by both the M-key handler and HUD button.
    const toggleMirror = useCallback(() => {
        const next = !mirrorActive;
        const tooltipShown = gameStore.get().mirrorLensTooltipShown;
        setMirrorActive(next);
        playMirrorChime(next ? "on" : "off");
        if (next && !tooltipShown) {
            setShowTooltip(true);
        }
    }, [mirrorActive]);

    const dismissTooltip = useCallback(() => {
        gameStore.set({ mirrorLensTooltipShown: true });
        setShowTooltip(false);
    }, []);

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
            let lines = buildScript(payload);
            if (!lines || lines.length === 0) return;
            // Drop mirror-only lines if Mirror Lens is currently off
            if (!mirrorRef.current) {
                lines = lines.filter((l) => !l.mirrorOnly);
            }

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
                toggleMirror();
            }
            if (e.code === "KeyJ") {
                navigate(`/journal/${id}`);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [id, navigate, toggleMirror]);

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
                onToggleMirror={toggleMirror}
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
                hiddenLabel={dialogue.hiddenLabel}
                mirrorActive={mirrorActive}
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
                onMirror={toggleMirror}
                onJournal={() => navigate(`/journal/${id}`)}
            />
        </div>
    );
}
