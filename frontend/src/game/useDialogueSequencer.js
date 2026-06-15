import { useCallback, useRef, useState } from "react";
import { gameEvents } from "@/game/events";
import { gameStore } from "@/game/useGameStore";
import { SPEAKER_HIDDEN_LABELS } from "@/game/dialogueScript";

/**
 * Manages a linear, optionally branching dialogue queue.
 * - enqueue(lines, onClose): start a new sequence
 * - advance(): show next line (or close if queue empty)
 * - choose(option): pick a choice when the current line has choices
 *
 * Emits scene:dialogue-lock and dialogue:done events so the Phaser scene
 * can pause hero movement during dialogue.
 */
export function useDialogueSequencer() {
    const [open, setOpen] = useState(false);
    const [speaker, setSpeaker] = useState(null);
    const [hiddenLabel, setHiddenLabel] = useState(null);
    const [text, setText] = useState("");
    const [kind, setKind] = useState("speech");
    const [choices, setChoices] = useState(null);
    const [choicePrompt, setChoicePrompt] = useState(null);
    const queueRef = useRef([]);
    const onCloseRef = useRef(null);
    const currentChoiceRef = useRef(null);

    const closeDialogue = useCallback(() => {
        setOpen(false);
        setChoices(null);
        setChoicePrompt(null);
        currentChoiceRef.current = null;
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
            currentChoiceRef.current = {
                choice: next.choice,
                speaker: next.speaker || null,
                hiddenLabel: next.hiddenLabel || null,
            };
        } else {
            setChoices(null);
            setChoicePrompt(null);
            currentChoiceRef.current = null;
        }
        setOpen(true);
        gameEvents.emit("scene:dialogue-lock", true);
    }, [closeDialogue]);

    const choose = useCallback((option) => {
        if (option.lantern) gameStore.adjustLantern(option.lantern);
        const currentChoice = currentChoiceRef.current;
        const outcomeSpeaker =
            option.outcomeSpeaker === undefined
                ? currentChoice?.speaker || "Tara"
                : option.outcomeSpeaker;
        const outcomeHidden =
            option.outcomeHiddenLabel ||
            (outcomeSpeaker && SPEAKER_HIDDEN_LABELS[outcomeSpeaker]) ||
            null;

        setChoices(null);
        setChoicePrompt(null);
        setSpeaker(outcomeSpeaker || null);
        setHiddenLabel(outcomeHidden);
        setKind(option.kind || "speech");
        setText(option.outcome);

        if (option.event?.name) {
            gameEvents.emit(option.event.name, option.event.payload || {});
        }

        if (option.afterLines?.length) {
            queueRef.current.unshift(...option.afterLines);
        }

        if (!option.advance) {
            const retrySpeaker =
                option.retrySpeaker === undefined
                    ? currentChoice?.speaker || "Tara"
                    : option.retrySpeaker;
            queueRef.current.unshift({
                speaker: retrySpeaker || null,
                hiddenLabel:
                    option.retryHiddenLabel ||
                    (retrySpeaker && SPEAKER_HIDDEN_LABELS[retrySpeaker]) ||
                    currentChoice?.hiddenLabel ||
                    null,
                text: option.retryText || "Try again. Speak from the honest place.",
                kind: option.retryKind || "speech",
                choice: currentChoice?.choice,
            });
        } else {
            if (option.unlockQuality) gameStore.unlockQuality(option.unlockQuality);
            if (option.id === "honest") gameStore.unlockQuality("truthful-response");
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
