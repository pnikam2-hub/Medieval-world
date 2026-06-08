import { useEffect, useRef } from "react";
import Phaser from "phaser";
import ChapterScene from "./ChapterScene";
import { gameEvents } from "./events";

export default function PhaserGame({ chapterId, hero, mirrorActive }) {
    const containerRef = useRef(null);
    const gameRef = useRef(null);
    const mountedRef = useRef(false);
    const lastChapterRef = useRef(chapterId);

    // Mount game once (guarded against double-mount in StrictMode)
    useEffect(() => {
        if (!containerRef.current) return undefined;
        if (mountedRef.current) return undefined;
        mountedRef.current = true;

        const game = new Phaser.Game({
            type: Phaser.AUTO,
            parent: containerRef.current,
            width: 960,
            height: 540,
            backgroundColor: "#050505",
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: 960,
                height: 540,
            },
            scene: [ChapterScene],
            physics: { default: "arcade" },
            input: { activePointers: 3 },
        });
        gameRef.current = game;

        game.scene.start("ChapterScene", {
            chapterId: lastChapterRef.current,
            accent: hero?.accent || "gold",
            heroName: hero?.name || "Arin",
        });

        return () => {
            game.destroy(true);
            gameRef.current = null;
            mountedRef.current = false;
        };
    }, [hero?.accent, hero?.name]);

    // Reload scene when chapter changes
    useEffect(() => {
        lastChapterRef.current = chapterId;
        const g = gameRef.current;
        if (!g) return;
        g.scene.stop("ChapterScene");
        g.scene.start("ChapterScene", {
            chapterId,
            accent: hero?.accent || "gold",
            heroName: hero?.name || "Arin",
        });
    }, [chapterId, hero?.accent, hero?.name]);

    // Sync mirror lens toggle to scene
    useEffect(() => {
        gameEvents.emit("mirror:toggle", mirrorActive);
    }, [mirrorActive]);

    return (
        <div
            ref={containerRef}
            data-testid="phaser-canvas-host"
            className={`absolute inset-0 ${mirrorActive ? "mirror-active" : ""}`}
            style={{
                background:
                    "radial-gradient(ellipse at center, #0e0e0e 0%, #050505 70%)",
            }}
        />
    );
}
