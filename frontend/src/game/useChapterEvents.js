import { useEffect, useRef } from "react";
import { gameEvents } from "@/game/events";
import { gameStore } from "@/game/useGameStore";
import { buildScript } from "@/game/dialogueScript";
import { CHAPTERS } from "@/game/chapters";
import {
    playHeartbeat,
    playLanternChime,
} from "@/game/sound";

/**
 * Subscribes to all Phaser-driven gameEvents (dialogue:open, script:start,
 * chapter:complete, hud:hint, lantern:adjust, fx:flicker, fx:bloom) and
 * routes them to React state via the provided handlers.
 *
 * @param {object} args
 * @param {(text:string|null)=>void} args.setHint - hint banner setter
 * @param {{current:object}} args.dialogueRef - ref to dialogue sequencer
 * @param {{current:boolean}} args.mirrorRef - ref to mirror lens active flag
 * @param {{current:boolean}} args.completedRef - ref guarding chapter completion
 * @param {(path:string)=>void} args.navigate - react-router navigate
 */
export function useChapterEvents({
    setHint,
    dialogueRef,
    mirrorRef,
    completedRef,
    navigate,
}) {
    const hintTimerRef = useRef(null);

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
            playHeartbeat();

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
            if (delta > 0) playLanternChime();
        });

        const offFlicker = gameEvents.on("fx:flicker", () => {
            playHeartbeat();
        });

        return () => {
            offOpen();
            offScript();
            offComplete();
            offHint();
            offLantern();
            offFlicker();
            if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
        };
    }, [navigate, setHint, dialogueRef, mirrorRef, completedRef]);
}
