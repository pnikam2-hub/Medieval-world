import { useEffect, useRef } from "react";
import { gameEvents } from "@/game/events";
import { gameStore } from "@/game/useGameStore";
import { buildScript } from "@/game/dialogueScript";
import {
    playHeartbeat,
    playLanternChime,
} from "@/game/sound";

/**
 * Subscribes to all Phaser-driven gameEvents (dialogue:open, script:start,
 * chapter:complete, hud:hint, lantern:adjust, fx:flicker, fx:bloom) and
 * routes them to React state via the provided handlers.
 */
export function useChapterEvents({
    setHint,
    setProgress,
    dialogueRef,
    mirrorRef,
    completedRef,
    onChapterComplete,
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

        const offComplete = gameEvents.on(
            "chapter:complete",
            ({ chapterId }) => {
                completedRef.current = true;
                gameStore.completeChapter(chapterId);
                gameStore.adjustLantern(0.18);
                if (chapterId === 5) gameStore.unlockQuality("presence");
                if (chapterId === 6) gameStore.unlockQuality("commitment");
                if (chapterId === 7) gameStore.unlockQuality("clarity");
                if (chapterId === 8) gameStore.unlockQuality("tenderness");
                if (chapterId === 9) gameStore.unlockQuality("stillness");
                if (chapterId === 10) gameStore.unlockQuality("connection");
                if (chapterId === 11) gameStore.unlockQuality("voice");
                if (chapterId === 13) gameStore.unlockQuality("wonder");
                playHeartbeat();
                onChapterComplete?.(chapterId);
            }
        );

        const offHint = gameEvents.on("hud:hint", (text) => {
            setHint(text);
            if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
            hintTimerRef.current = setTimeout(() => setHint(null), 4200);
        });

        const offProgress = gameEvents.on("chapter:progress", (payload) => {
            setProgress?.(payload);
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
            offProgress();
            offLantern();
            offFlicker();
            if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
        };
    }, [
        setHint,
        setProgress,
        dialogueRef,
        mirrorRef,
        completedRef,
        onChapterComplete,
    ]);
}
