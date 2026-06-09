import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PhaserGame from "@/game/PhaserGame";
import HUD from "@/components/HUD";
import DialogueBox from "@/components/DialogueBox";
import MobileControls from "@/components/MobileControls";
import MirrorOverlay from "@/components/MirrorOverlay";
import { CHAPTERS } from "@/game/chapters";
import { gameStore, useGameStore } from "@/game/useGameStore";
import { useDialogueSequencer } from "@/game/useDialogueSequencer";
import { useChapterEvents } from "@/game/useChapterEvents";
import {
    playMirrorChime,
    startAmbient,
    stopAmbient,
    isMuted,
    toggleMuted,
} from "@/game/sound";

export default function GameScreen() {
    const { chapterId } = useParams();
    const id = parseInt(chapterId, 10) || 1;
    const navigate = useNavigate();
    const state = useGameStore();
    const chapter = useMemo(() => CHAPTERS.find((c) => c.id === id), [id]);

    const [mirrorActive, setMirrorActive] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [hint, setHint] = useState(null);
    const [muted, setMutedState] = useState(isMuted());

    const mirrorRef = useRef(mirrorActive);
    const completedRef = useRef(false);

    const dialogue = useDialogueSequencer();
    const dialogueRef = useRef(dialogue);
    dialogueRef.current = dialogue;
    mirrorRef.current = mirrorActive;

    // Single source of truth for Mirror Lens toggle (M-key + HUD + mobile).
    const toggleMirror = useCallback(() => {
        const next = !mirrorActive;
        const tooltipShown = gameStore.get().mirrorLensTooltipShown;
        setMirrorActive(next);
        playMirrorChime(next ? "on" : "off");
        if (next && !tooltipShown) setShowTooltip(true);
    }, [mirrorActive]);

    const dismissTooltip = useCallback(() => {
        gameStore.set({ mirrorLensTooltipShown: true });
        setShowTooltip(false);
    }, []);

    const handleToggleMute = useCallback(() => {
        const next = toggleMuted();
        setMutedState(next);
    }, []);

    // Persist current chapter and reset per-chapter completion guard
    useEffect(() => {
        gameStore.set({ currentChapter: id });
        completedRef.current = false;
    }, [id]);

    // Ambient drone for the duration of the game screen
    useEffect(() => {
        startAmbient();
        return () => {
            stopAmbient();
        };
    }, []);

    // Wire all gameEvents (dialogue, hint, lantern, completion, fx)
    useChapterEvents({
        setHint,
        dialogueRef,
        mirrorRef,
        completedRef,
        navigate,
    });

    // Keyboard: M = mirror, J = journal
    useEffect(() => {
        const handler = (e) => {
            if (e.code === "KeyM") toggleMirror();
            if (e.code === "KeyJ") navigate(`/journal/${id}`);
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
                muted={muted}
                onToggleMute={handleToggleMute}
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
