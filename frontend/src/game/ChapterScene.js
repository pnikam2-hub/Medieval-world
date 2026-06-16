import Phaser from "phaser";
import { gameEvents } from "./events";
import {
    INWARD_THRESHOLD_MARKERS,
    INITIATION_STONES,
    MEMORY_BUOYS,
    RIVER_HELPERS,
    TRIAL_FIRES,
} from "./chapters";

const W = 960;
const H = 540;
const HERO_SPEED = 170;

// Accent color -> hero lantern hex
const ACCENT_HEX = {
    gold: 0xfadb5f,
    ember: 0xfb8500,
    moon: 0xe2e8f0,
};

export default class ChapterScene extends Phaser.Scene {
    constructor() {
        super("ChapterScene");
    }

    init(data) {
        this.chapterId = data.chapterId ?? 1;
        this.heroAccent = data.accent ?? "gold";
        this.heroName = data.heroName ?? "Arin";
        this.mobileInput = { left: false, right: false, up: false, down: false };
        this.completed = false;
        this.dialogueOpen = false;
        this.mirrorActive = false;
        this.lastProgressBucket = -1;
        this.nearPromptTarget = null;
    }

    create() {
        const { chapterId } = this;
        this.cameras.main.setBackgroundColor("#0a0a0a");

        this.bgLayer = this.add.container(0, 0);
        this.fxLayer = this.add.container(0, 0);
        this.worldLayer = this.add.container(0, 0);
        this.foreLayer = this.add.container(0, 0);

        this._buildBackdrop();
        this._buildHero();
        this._buildInteractPrompt();
        this._setupInput();

        // Per-chapter setup
        if (chapterId === 1) this._setupChapter1();
        else if (chapterId === 2) this._setupChapter2();
        else if (chapterId === 3) this._setupChapter3();
        else if (chapterId === 4) this._setupChapter4();
        else if (chapterId === 5) this._setupChapter5();
        else if (chapterId === 6) this._setupChapter6();
        else if (chapterId === 7) this._setupChapter7();
        else if (chapterId === 8) this._setupChapter8();
        else if (chapterId === 9) this._setupChapter9();
        else if (chapterId === 10) this._setupChapter10();
        else if (chapterId === 11) this._setupChapter11();
        else if (chapterId === 12) this._setupChapter12();
        else if (chapterId === 13) this._setupChapter13();

        // Mirror lens toggle from React
        this._onMirror = (active) => {
            this.mirrorActive = active;
            this._refreshMirror();
        };
        gameEvents.on("mirror:toggle", this._onMirror);

        // Mobile virtual input
        this._onMobile = (input) => {
            this.mobileInput = { ...this.mobileInput, ...input };
        };
        gameEvents.on("input:mobile", this._onMobile);

        // External request to advance dialogue handled here when scripted
        this._onDialogueDone = () => {
            this.dialogueOpen = false;
            if (this._afterDialogue) {
                const fn = this._afterDialogue;
                this._afterDialogue = null;
                fn();
            }
        };
        gameEvents.on("dialogue:done", this._onDialogueDone);

        // Lock/unlock movement when dialogue is shown in React
        this._onLock = (locked) => {
            this.dialogueOpen = !!locked;
        };
        gameEvents.on("scene:dialogue-lock", this._onLock);

        // Chapter 5 fear trial trigger
        this._onFearTrial = () => {
            if (this.startFearTrial) this.startFearTrial();
        };
        gameEvents.on("fear:trial-start", this._onFearTrial);

        this._onTrialFireChoice = (payload) => {
            if (this.chapterId === 8) this._handleTrialFireChoice(payload);
        };
        gameEvents.on("trial-fire:choice", this._onTrialFireChoice);

        // Cleanup
        this.events.once("shutdown", () => {
            gameEvents.off("mirror:toggle", this._onMirror);
            gameEvents.off("input:mobile", this._onMobile);
            gameEvents.off("dialogue:done", this._onDialogueDone);
            gameEvents.off("scene:dialogue-lock", this._onLock);
            gameEvents.off("fear:trial-start", this._onFearTrial);
            gameEvents.off("trial-fire:choice", this._onTrialFireChoice);
        });
    }

    // ------------------------------------------------------------------
    // Visuals
    // ------------------------------------------------------------------
    _buildBackdrop() {
        // Sky / ash gradient
        const sky = this.add.graphics();
        sky.fillGradientStyle(0x141414, 0x141414, 0x080808, 0x080808, 1);
        sky.fillRect(0, 0, W, H);
        this.bgLayer.add(sky);

        // Distant building silhouettes for wasteland chapters
        if ([1, 2].includes(this.chapterId)) {
            const buildings = this.add.graphics();
            buildings.fillStyle(0x1c1c1c, 1);
            for (let i = 0; i < 14; i++) {
                const bw = 60 + Math.random() * 90;
                const bh = 120 + Math.random() * 220;
                buildings.fillRect(i * 70 - 20, H - bh - 80, bw, bh);
            }
            this.bgLayer.add(buildings);

            const closer = this.add.graphics();
            closer.fillStyle(0x0f0f0f, 1);
            for (let i = 0; i < 10; i++) {
                const bw = 90 + Math.random() * 130;
                const bh = 60 + Math.random() * 160;
                closer.fillRect(i * 110 - 30, H - bh - 60, bw, bh);
            }
            this.bgLayer.add(closer);
        }

        if ([4, 12].includes(this.chapterId)) {
            // Open road out of city, soft hills
            const hills = this.add.graphics();
            hills.fillStyle(this.chapterId === 12 ? 0x15110e : 0x121212, 1);
            hills.fillEllipse(W * 0.2, H - 30, 600, 220);
            hills.fillEllipse(W * 0.7, H - 20, 720, 260);
            if (this.chapterId === 12) {
                hills.fillStyle(0xfadb5f, 0.035);
                hills.fillEllipse(W * 0.5, H * 0.62, W * 0.54, H * 0.62);
                hills.lineStyle(1, 0xe2e8f0, 0.05);
                for (let i = 0; i < 9; i++) {
                    hills.strokeRoundedRect(120 + i * 78, 70 + i * 3, 44, H - 158, 18);
                }
            }
            this.bgLayer.add(hills);
        }

        if ([13].includes(this.chapterId)) {
            const vast = this.add.graphics();
            vast.fillGradientStyle(0x02030a, 0x040714, 0x08111f, 0x02030a, 1);
            vast.fillRect(0, 0, W, H);
            vast.fillStyle(0xfadb5f, 0.035);
            vast.fillEllipse(W / 2, H - 72, W * 0.78, 120);
            this.bgLayer.add(vast);

            for (let i = 0; i < 120; i++) {
                const lx = 40 + Math.random() * (W - 80);
                const ly = 40 + Math.random() * (H - 170);
                const radius = 0.7 + Math.random() * 1.9;
                const dot = this.add.circle(lx, ly, radius, 0xfadb5f, 0.25 + Math.random() * 0.55);
                dot.setBlendMode(Phaser.BlendModes.ADD);
                this.tweens.add({
                    targets: dot,
                    alpha: { from: 0.15, to: 0.95 },
                    scale: { from: 0.8, to: 1.35 },
                    duration: 2200 + Math.random() * 4200,
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut",
                });
                this.bgLayer.add(dot);
            }
        }

        if ([8].includes(this.chapterId)) {
            const dusk = this.add.graphics();
            dusk.fillGradientStyle(0x10172a, 0x10172a, 0x24120b, 0x060606, 1);
            dusk.fillRect(0, 0, W, H);
            dusk.fillStyle(0xfb8500, 0.07);
            dusk.fillEllipse(W * 0.28, H * 0.76, W * 0.85, H * 0.32);
            dusk.fillStyle(0x0c0d10, 1);
            dusk.fillEllipse(W * 0.26, H - 34, 620, 190);
            dusk.fillEllipse(W * 0.78, H - 22, 700, 210);
            this.bgLayer.add(dusk);
        }

        if ([10].includes(this.chapterId)) {
            const dawn = this.add.graphics();
            dawn.fillGradientStyle(0xdbeafe, 0xfef3c7, 0x172554, 0x082f49, 1);
            dawn.fillRect(0, 0, W, H);
            dawn.fillStyle(0x38bdf8, 0.28);
            dawn.fillRect(0, H - 170, W, 78);
            dawn.fillStyle(0x0ea5e9, 0.18);
            dawn.fillRect(0, H - 132, W, 42);
            dawn.fillStyle(0x102018, 0.9);
            dawn.fillEllipse(W * 0.4, H - 36, W * 0.95, 138);
            dawn.fillEllipse(W * 0.88, H - 26, W * 0.56, 112);
            this.bgLayer.add(dawn);

            for (let i = 0; i < 24; i++) {
                const sparkle = this.add.circle(
                    40 + Math.random() * (W - 80),
                    H - 160 + Math.random() * 60,
                    1.2,
                    0xfadb5f,
                    0.35
                );
                sparkle.setBlendMode(Phaser.BlendModes.ADD);
                this.tweens.add({
                    targets: sparkle,
                    x: sparkle.x + 30 + Math.random() * 70,
                    alpha: { from: 0.15, to: 0.65 },
                    duration: 1800 + Math.random() * 1800,
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut",
                });
                this.bgLayer.add(sparkle);
            }
        }

        if ([11].includes(this.chapterId)) {
            const chamber = this.add.graphics();
            chamber.fillGradientStyle(0x07060a, 0x0c0a12, 0x17111b, 0x050505, 1);
            chamber.fillRect(0, 0, W, H);
            chamber.fillStyle(0xfadb5f, 0.035);
            chamber.fillEllipse(W / 2, H * 0.58, W * 0.72, H * 0.52);
            chamber.lineStyle(1, 0xfadb5f, 0.08);
            for (let i = 0; i < 7; i++) {
                chamber.strokeCircle(W / 2, H - 94, 70 + i * 34);
            }
            this.bgLayer.add(chamber);
        }

        if ([3].includes(this.chapterId)) {
            // Cave of Echoes
            const cave = this.add.graphics();
            cave.fillStyle(0x0a0807, 1);
            cave.fillRect(0, 0, W, H);
            cave.fillStyle(0x1a120a, 1);
            cave.fillEllipse(W / 2, H + 60, W * 1.4, H * 1.4);
            this.bgLayer.add(cave);

            // Tiny memory lanterns floating
            for (let i = 0; i < 16; i++) {
                const lx = 80 + Math.random() * (W - 160);
                const ly = 80 + Math.random() * (H - 220);
                const dot = this.add.circle(lx, ly, 2, 0xfadb5f, 0.9);
                dot.setBlendMode(Phaser.BlendModes.ADD);
                this.tweens.add({
                    targets: dot,
                    alpha: { from: 0.3, to: 1 },
                    duration: 1400 + Math.random() * 1800,
                    yoyo: true,
                    repeat: -1,
                });
                this.bgLayer.add(dot);
            }
        }

        if ([5].includes(this.chapterId)) {
            const dark = this.add.graphics();
            dark.fillStyle(0x05050a, 1);
            dark.fillRect(0, 0, W, H);
            this.bgLayer.add(dark);
        }

        if ([9].includes(this.chapterId)) {
            const sea = this.add.graphics();
            sea.fillGradientStyle(0x030714, 0x04091d, 0x071327, 0x02040a, 1);
            sea.fillRect(0, 0, W, H);
            sea.fillStyle(0x10244a, 0.5);
            sea.fillRect(0, H - 190, W, 130);
            sea.fillStyle(0x0d1833, 0.85);
            sea.fillRect(0, H - 110, W, 70);
            this.bgLayer.add(sea);

            for (let i = 0; i < 42; i++) {
                const star = this.add.circle(
                    30 + Math.random() * (W - 60),
                    34 + Math.random() * (H - 260),
                    0.8 + Math.random() * 1.4,
                    0xdbeafe,
                    0.25 + Math.random() * 0.6
                );
                star.setBlendMode(Phaser.BlendModes.ADD);
                this.tweens.add({
                    targets: star,
                    alpha: { from: star.alpha, to: Math.min(1, star.alpha + 0.35) },
                    duration: 1200 + Math.random() * 2200,
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut",
                });
                this.bgLayer.add(star);
            }
        }

        if ([6].includes(this.chapterId)) {
            const beyond = this.add.graphics();
            beyond.fillGradientStyle(0x060706, 0x080a10, 0x10120c, 0x060606, 1);
            beyond.fillRect(0, 0, W, H);
            beyond.fillStyle(0xfadb5f, 0.05);
            beyond.fillEllipse(W * 0.62, H * 0.52, W * 0.75, H * 0.8);
            beyond.lineStyle(1, 0xfadb5f, 0.1);
            for (let i = 0; i < 8; i++) {
                const y = 90 + i * 42;
                beyond.lineBetween(W * 0.08, y, W * 0.92, y + Math.sin(i) * 18);
            }
            this.bgLayer.add(beyond);
        }

        if ([7].includes(this.chapterId)) {
            const helperField = this.add.graphics();
            helperField.fillGradientStyle(0x080908, 0x0b0a10, 0x15120c, 0x060606, 1);
            helperField.fillRect(0, 0, W, H);
            helperField.fillStyle(0xfadb5f, 0.055);
            helperField.fillEllipse(W * 0.48, H * 0.46, W * 0.62, H * 0.62);
            helperField.fillStyle(0x91c5ff, 0.035);
            helperField.fillEllipse(W * 0.72, H * 0.36, W * 0.42, H * 0.5);
            this.bgLayer.add(helperField);

            for (let i = 0; i < 14; i++) {
                const lx = 90 + Math.random() * (W - 180);
                const ly = 70 + Math.random() * (H - 210);
                const shard = this.add.circle(lx, ly, 1.8, 0xfadb5f, 0.8);
                shard.setBlendMode(Phaser.BlendModes.ADD);
                this.tweens.add({
                    targets: shard,
                    alpha: { from: 0.25, to: 0.95 },
                    y: ly - 6,
                    duration: 1300 + Math.random() * 1800,
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut",
                });
                this.bgLayer.add(shard);
            }
        }

        // Ground
        const ground = this.add.graphics();
        ground.fillStyle(0x0a0a0a, 1);
        ground.fillRect(0, H - 60, W, 60);
        this.bgLayer.add(ground);

        // Fog layer (animated)
        this.fog = this.add.graphics();
        this.fxLayer.add(this.fog);
        this._fogOffset = 0;
    }

    _buildHero() {
        const heroColor = ACCENT_HEX[this.heroAccent] || ACCENT_HEX.gold;

        this.hero = this.add.container(W * 0.18, H - 110);
        // Body silhouette
        const body = this.add.graphics();
        body.fillStyle(0x1d1d1d, 1);
        body.fillRoundedRect(-10, -38, 20, 38, 4); // torso
        body.fillCircle(0, -46, 8); // head
        body.fillRect(-10, 0, 6, 18); // leg
        body.fillRect(4, 0, 6, 18); // leg
        // Cloak edge highlight
        body.lineStyle(1, 0x2a2a2a, 1);
        body.strokeRoundedRect(-10, -38, 20, 38, 4);

        // Heart lantern (glow)
        const lantern = this.add.circle(0, -22, 4.5, heroColor, 1);
        lantern.setBlendMode(Phaser.BlendModes.ADD);
        const lanternHalo = this.add.circle(0, -22, 14, heroColor, 0.18);
        lanternHalo.setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({
            targets: lanternHalo,
            scale: { from: 0.85, to: 1.25 },
            alpha: { from: 0.12, to: 0.32 },
            duration: 1700,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
        });

        this.hero.add([body, lanternHalo, lantern]);
        this.heroLantern = lantern;
        this.heroLanternHalo = lanternHalo;
        this.worldLayer.add(this.hero);

        this.hero.heading = "right";
    }

    _buildInteractPrompt() {
        this.interactPrompt = this.add.container(0, 0);
        const bg = this.add.graphics();
        bg.fillStyle(0x080808, 0.78);
        bg.fillRoundedRect(-70, -16, 140, 32, 5);
        bg.lineStyle(1, 0xfadb5f, 0.55);
        bg.strokeRoundedRect(-70, -16, 140, 32, 5);
        const text = this.add.text(0, 0, "Space / Interact", {
            fontFamily: "Outfit, sans-serif",
            fontSize: "11px",
            color: "#fadb5f",
            align: "center",
        });
        text.setOrigin(0.5);
        this.interactPrompt.add([bg, text]);
        this.interactPrompt.setAlpha(0);
        this.interactPrompt.setDepth(20);
        this.foreLayer.add(this.interactPrompt);
        this.interactPromptLabel = text;
    }

    _setupInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyW = this.input.keyboard.addKey("W");
        this.keyA = this.input.keyboard.addKey("A");
        this.keyS = this.input.keyboard.addKey("S");
        this.keyD = this.input.keyboard.addKey("D");
        this.keySpace = this.input.keyboard.addKey("SPACE");
        this.keyEnter = this.input.keyboard.addKey("ENTER");

        this.keySpace.on("down", () => this._tryInteract());
        this.keyEnter.on("down", () => this._tryInteract());
    }

    // ------------------------------------------------------------------
    // Chapter 1: Wasteland — 3 citizens + 3 heartbeat pulses
    // ------------------------------------------------------------------
    _setupChapter1() {
        this.citizens = [];
        const citizenData = [
            { id: "citizen-a", x: 0.32, surfaceLabel: "I am fine", hiddenLabel: "Exhaustion" },
            { id: "citizen-b", x: 0.55, surfaceLabel: "Nothing changes", hiddenLabel: "Loneliness" },
            { id: "citizen-c", x: 0.78, surfaceLabel: "Keep walking", hiddenLabel: "Unspoken grief" },
        ];
        citizenData.forEach((c) => {
            const px = W * c.x;
            const cont = this._makeNpc(px, H - 110, "Citizen", {
                surfaceLabel: c.surfaceLabel,
                hiddenLabel: c.hiddenLabel,
            });
            cont.npcId = c.id;
            cont.kind = "citizen";
            cont.spoken = false;
            this.worldLayer.add(cont);
            this.citizens.push(cont);
        });

        // 3 heartbeat pulses scattered (interactable points on the ground)
        this.pulses = [];
        const pulsePositions = [0.16, 0.45, 0.7];
        pulsePositions.forEach((px, idx) => {
            const x = W * px;
            const y = H - 70;
            const cont = this.add.container(x, y);
            const ring = this.add.circle(0, 0, 18, 0xfadb5f, 0);
            ring.setStrokeStyle(1, 0xfadb5f, 0.7);
            ring.setBlendMode(Phaser.BlendModes.ADD);
            const core = this.add.circle(0, 0, 4, 0xfadb5f, 0.9);
            core.setBlendMode(Phaser.BlendModes.ADD);
            this.tweens.add({
                targets: ring,
                scale: { from: 0.6, to: 1.6 },
                alpha: { from: 0.8, to: 0 },
                duration: 1800,
                repeat: -1,
                ease: "sine.out",
            });
            cont.add([ring, core]);
            cont.kind = "pulse";
            cont.collected = false;
            cont.idx = idx;
            this._attachMirrorLabels(
                cont,
                "Faint pulse",
                "Hope still present",
                -32
            );
            this.worldLayer.add(cont);
            this.pulses.push(cont);
        });

        this._showNarration(
            "In the City of Dust, no one was sad, no one was joyful, and no one asked why the sky had forgotten blue."
        );
        this._emitChapter1Progress();
        gameEvents.emit("hud:hint", "Use arrows or WASD to move. Press Space near people or glowing pulses.");
    }

    // ------------------------------------------------------------------
    // Chapter 2: The Call — follow 3 sequential pulses
    // ------------------------------------------------------------------
    _setupChapter2() {
        this.trailPulses = [];
        const trail = [0.32, 0.52, 0.78];
        trail.forEach((px, idx) => {
            const x = W * px;
            const y = H - 90;
            const cont = this.add.container(x, y);
            const ring = this.add.circle(0, 0, 22, 0xfadb5f, 0);
            ring.setStrokeStyle(1, 0xfadb5f, 0.8);
            ring.setBlendMode(Phaser.BlendModes.ADD);
            const core = this.add.circle(0, 0, 6, 0xfadb5f, 1);
            core.setBlendMode(Phaser.BlendModes.ADD);
            this.tweens.add({
                targets: ring,
                scale: { from: 0.7, to: 1.8 },
                alpha: { from: 0.9, to: 0 },
                duration: 1600,
                repeat: -1,
                ease: "sine.out",
            });
            cont.add([ring, core]);
            cont.kind = "trail";
            cont.collected = false;
            cont.idx = idx;
            cont.active = idx === 0;
            cont.setAlpha(idx === 0 ? 1 : 0.2);
            this._attachMirrorLabels(
                cont,
                "Echo",
                "The call, remembered",
                -38
            );
            this.worldLayer.add(cont);
            this.trailPulses.push(cont);
        });

        // Mural at far right
        const mural = this.add.container(W - 90, H - 130);
        const m = this.add.graphics();
        m.fillStyle(0x2c1f0d, 1);
        m.fillRoundedRect(-30, -60, 60, 80, 6);
        m.lineStyle(1, 0xd4af37, 0.5);
        m.strokeRoundedRect(-30, -60, 60, 80, 6);
        // Mural symbol — circle with line
        m.lineStyle(1, 0xfadb5f, 0.9);
        m.strokeCircle(0, -30, 14);
        m.lineBetween(0, -30, 0, -8);
        mural.add(m);
        // Mirror labels for the mural
        const muralSurface = this.add.text(0, -88, "Ancient mural", {
            fontFamily: "Outfit, sans-serif",
            fontSize: "11px",
            color: "#9a9a9a",
            fontStyle: "italic",
        });
        muralSurface.setOrigin(0.5, 1).setAlpha(0.85);
        const muralHidden = this.add.text(0, -88, "A door, a memory", {
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "16px",
            color: "#fadb5f",
            fontStyle: "italic",
        });
        muralHidden.setOrigin(0.5, 1).setAlpha(0).setBlendMode(Phaser.BlendModes.ADD);
        muralHidden._baseY = -88;
        const muralHalo = this.add.circle(0, -70, 34, 0xfadb5f, 0);
        muralHalo.setBlendMode(Phaser.BlendModes.ADD);
        mural.add([muralHalo, muralSurface, muralHidden]);
        mural.surfaceLabel = muralSurface;
        mural.hiddenLabel = muralHidden;
        mural.mirrorHalo = muralHalo;
        mural.kind = "mural";
        mural.active = false;
        this.worldLayer.add(mural);
        this.mural = mural;

        this._colorBloom = 0;
        this._showNarration(
            "Beneath the city, a heartbeat. You step toward it like a memory finding its name."
        );
        this._emitChapter2Progress();
        gameEvents.emit("hud:hint", "Follow each heartbeat pulse in order.");
    }

    // ------------------------------------------------------------------
    // Chapter 3: Reluctant Hero — Tara dialogue (no movement required)
    // ------------------------------------------------------------------
    _setupChapter3() {
        // Tara appears at center-right
        const tara = this.add.container(W * 0.65, H - 110);
        const robe = this.add.graphics();
        robe.fillStyle(0x6b4a18, 0.9);
        robe.fillTriangle(-22, 0, 22, 0, 0, -52);
        robe.fillCircle(0, -56, 9);
        robe.lineStyle(1, 0xd4af37, 0.6);
        robe.strokeTriangle(-22, 0, 22, 0, 0, -52);
        // Tara's lantern in hand
        const lantern = this.add.circle(16, -22, 5, 0xfadb5f, 1);
        lantern.setBlendMode(Phaser.BlendModes.ADD);
        const halo = this.add.circle(16, -22, 18, 0xfadb5f, 0.18);
        halo.setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({
            targets: halo,
            scale: { from: 0.9, to: 1.4 },
            alpha: { from: 0.18, to: 0.32 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
        });
        tara.add([robe, halo, lantern]);
        // Mirror labels for Tara
        const taraSurface = this.add.text(0, -80, "Stranger", {
            fontFamily: "Outfit, sans-serif",
            fontSize: "11px",
            color: "#9a9a9a",
            fontStyle: "italic",
        });
        taraSurface.setOrigin(0.5, 1).setAlpha(0.85);
        const taraHidden = this.add.text(0, -80, "Myth keeper", {
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "16px",
            color: "#fadb5f",
            fontStyle: "italic",
        });
        taraHidden.setOrigin(0.5, 1).setAlpha(0).setBlendMode(Phaser.BlendModes.ADD);
        taraHidden._baseY = -80;
        const taraMirrorHalo = this.add.circle(0, -60, 36, 0xfadb5f, 0);
        taraMirrorHalo.setBlendMode(Phaser.BlendModes.ADD);
        tara.add([taraMirrorHalo, taraSurface, taraHidden]);
        tara.surfaceLabel = taraSurface;
        tara.hiddenLabel = taraHidden;
        tara.mirrorHalo = taraMirrorHalo;
        tara.kind = "tara";
        this.worldLayer.add(tara);
        this.tara = tara;

        // Move hero toward Tara automatically and start scripted dialogue
        this._showNarration(
            "An elder waits in the cave, lit by a hundred small lanterns of memory."
        );
        gameEvents.emit("chapter:progress", {
            objective: "Speak honestly with Tara.",
            detail: "When choices appear, pick the answer that admits what the hero truly feels.",
            phase: "Cave of Echoes",
        });

        this.time.delayedCall(2400, () => {
            // walk hero to position
            this.tweens.add({
                targets: this.hero,
                x: W * 0.45,
                duration: 1500,
                ease: "sine.inOut",
                onComplete: () => {
                    gameEvents.emit("script:start", { name: "tara-dialogue" });
                },
            });
        });
    }

    // ------------------------------------------------------------------
    // Chapter 4: Separation — move right while fog pulls back
    // ------------------------------------------------------------------
    _setupChapter4() {
        this.fogStrength = 1.0; // strong fog at start
        this.kaviSpawned = false;

        // Goal: right threshold
        const goal = this.add.container(W - 60, H - 110);
        const gate = this.add.graphics();
        gate.lineStyle(2, 0xd4af37, 0.7);
        gate.strokeRoundedRect(-22, -56, 44, 56, 4);
        gate.fillStyle(0xfadb5f, 0.06);
        gate.fillRoundedRect(-22, -56, 44, 56, 4);
        goal.add(gate);
        goal.kind = "gate";
        this.worldLayer.add(goal);
        this.gate = goal;

        // Spawn Kavi from hero's lantern after short delay
        this.time.delayedCall(1600, () => {
            this._spawnKavi();
            gameEvents.emit("script:start", { name: "kavi-dialogue" });
        });

        this._showNarration(
            "A small golden firefly slips from your chest-lantern. It looks at you as if it has known you forever."
        );
        this._emitTraversalProgress(
            "Follow Kavi beyond the city.",
            "Hold right through the fog until you reach the threshold gate.",
            "Open road"
        );
    }

    // ------------------------------------------------------------------
    // Chapter 5: Fear — shadow waves + safe-pulse traversal
    // ------------------------------------------------------------------
    _setupChapter5() {
        // Shadow twin appears
        const twin = this.add.container(W * 0.6, H - 110);
        const tBody = this.add.graphics();
        tBody.fillStyle(0x222035, 1);
        tBody.fillRoundedRect(-10, -38, 20, 38, 4);
        tBody.fillCircle(0, -46, 8);
        // smoke aura
        const aura = this.add.circle(0, -22, 26, 0x4b4f7a, 0.18);
        aura.setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({
            targets: aura,
            scale: { from: 0.9, to: 1.3 },
            alpha: { from: 0.18, to: 0.05 },
            duration: 1400,
            yoyo: true,
            repeat: -1,
        });
        twin.add([aura, tBody]);
        // Mirror labels for Shadow Twin
        const twinSurface = this.add.text(0, -80, "Fear", {
            fontFamily: "Outfit, sans-serif",
            fontSize: "11px",
            color: "#9a9a9a",
            fontStyle: "italic",
        });
        twinSurface.setOrigin(0.5, 1).setAlpha(0.85);
        const twinHidden = this.add.text(0, -80, "Wounded, protective self", {
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "16px",
            color: "#fadb5f",
            fontStyle: "italic",
        });
        twinHidden.setOrigin(0.5, 1).setAlpha(0).setBlendMode(Phaser.BlendModes.ADD);
        twinHidden._baseY = -80;
        const twinMirrorHalo = this.add.circle(0, -60, 36, 0xfadb5f, 0);
        twinMirrorHalo.setBlendMode(Phaser.BlendModes.ADD);
        twin.add([twinMirrorHalo, twinSurface, twinHidden]);
        twin.surfaceLabel = twinSurface;
        twin.hiddenLabel = twinHidden;
        twin.mirrorHalo = twinMirrorHalo;
        twin.kind = "twin";
        this.worldLayer.add(twin);
        this.shadowTwin = twin;

        // Threshold gate at far right
        const gate = this.add.container(W - 60, H - 110);
        const gg = this.add.graphics();
        gg.lineStyle(2, 0xfadb5f, 0.9);
        gg.strokeRoundedRect(-22, -64, 44, 64, 4);
        gg.fillStyle(0xfadb5f, 0.1);
        gg.fillRoundedRect(-22, -64, 44, 64, 4);
        gate.add(gg);
        gate.kind = "gate-fear";
        this.worldLayer.add(gate);
        this.fearGate = gate;

        // Heart-pulse cycle state
        this.fearCycleT = 0;
        this.fearSafe = true; // alternates
        this.fearDistance = 0;
        this.fearWaves = [];

        // Pre-trial dialogue then unlock movement
        this.fearTrialActive = false;
        this.time.delayedCall(1200, () => {
            gameEvents.emit("script:start", { name: "shadow-dialogue" });
        });

        this._showNarration(
            "At the first dark threshold, something that wears your face is waiting."
        );
        gameEvents.emit("chapter:progress", {
            objective: "Face the Shadow Twin.",
            detail: "Advance the dialogue, then cross the fear field without rushing.",
            phase: "Before the threshold",
        });
    }

    startFearTrial() {
        this.fearTrialActive = true;
        gameEvents.emit("hud:trial", {
            label: "Move only with the steady pulse.",
        });
        gameEvents.emit("hud:hint", "Cross during steady light. Pause when fear stirs.");
        this._emitFearProgress();
    }

    // ------------------------------------------------------------------
    // Chapter 6: Threshold Crossing - collect vows, then cross
    // ------------------------------------------------------------------
    _setupChapter6() {
        this.thresholdAnchors = [];
        this.thresholdGateOpen = false;
        this.thresholdGateHintShown = false;

        const entryGate = this.add.container(W * 0.16, H - 110);
        const entry = this.add.graphics();
        entry.lineStyle(1, 0x8a6f24, 0.5);
        entry.strokeRoundedRect(-18, -58, 36, 58, 4);
        entry.fillStyle(0xfadb5f, 0.04);
        entry.fillRoundedRect(-18, -58, 36, 58, 4);
        entryGate.add(entry);
        this.worldLayer.add(entryGate);

        const gate = this.add.container(W - 70, H - 110);
        const frame = this.add.graphics();
        frame.lineStyle(2, 0xd4af37, 0.45);
        frame.strokeRoundedRect(-24, -70, 48, 70, 5);
        frame.fillStyle(0xfadb5f, 0.05);
        frame.fillRoundedRect(-24, -70, 48, 70, 5);
        const core = this.add.circle(0, -35, 10, 0xfadb5f, 0.08);
        core.setBlendMode(Phaser.BlendModes.ADD);
        gate.add([frame, core]);
        gate.kind = "second-gate";
        this._attachMirrorLabels(gate, "Second gate", "Commitment becomes passage", -84);
        this.worldLayer.add(gate);
        this.secondGate = gate;
        this.secondGateCore = core;

        const vows = [
            {
                x: 0.34,
                surface: "I will be ready first",
                hidden: "Begin before certainty",
            },
            {
                x: 0.52,
                surface: "I should go alone",
                hidden: "Accept help without shrinking",
            },
            {
                x: 0.7,
                surface: "I must not change",
                hidden: "Let the path remake me",
            },
        ];

        vows.forEach((vow, idx) => {
            const anchor = this.add.container(W * vow.x, H - 88);
            const ring = this.add.circle(0, 0, 18, 0xfadb5f, 0);
            ring.setStrokeStyle(1, 0xfadb5f, 0.65);
            ring.setBlendMode(Phaser.BlendModes.ADD);
            const diamond = this.add.graphics();
            diamond.fillStyle(0xd4af37, 0.85);
            diamond.fillPoints(
                [
                    { x: 0, y: -8 },
                    { x: 8, y: 0 },
                    { x: 0, y: 8 },
                    { x: -8, y: 0 },
                ],
                true
            );
            diamond.setBlendMode(Phaser.BlendModes.ADD);
            this.tweens.add({
                targets: ring,
                scale: { from: 0.75, to: 1.45 },
                alpha: { from: 0.8, to: 0.1 },
                duration: 1700,
                repeat: -1,
                ease: "sine.out",
            });
            anchor.add([ring, diamond]);
            anchor.kind = "threshold-anchor";
            anchor.idx = idx;
            anchor.collected = false;
            this._attachMirrorLabels(anchor, vow.surface, vow.hidden, -34);
            this.worldLayer.add(anchor);
            this.thresholdAnchors.push(anchor);
        });

        this._showNarration(
            "Beyond the first gate, the world is not brighter. It is simply more honest."
        );
        this._emitChapter6Progress();
        gameEvents.emit(
            "hud:hint",
            "Collect the three threshold vows, then cross the second gate."
        );
    }

    // ------------------------------------------------------------------
    // Chapter 7: Magical Helper - Tara teaches the deeper Mirror Lens
    // ------------------------------------------------------------------
    _setupChapter7() {
        this.helperPhase = "tara-teaching";
        this.helperShardsCollected = 0;
        this.kaviSeenDeep = false;
        this.memoryShards = [];

        const tara = this._makeNpc(W * 0.34, H - 110, "Tara", {
            surfaceLabel: "Teacher",
            hiddenLabel: "Keeper of clear seeing",
        });
        const cloak = this.add.graphics();
        cloak.lineStyle(1, 0xfadb5f, 0.45);
        cloak.strokeCircle(0, -40, 18);
        tara.add(cloak);
        tara.kind = "tara-helper";
        this.worldLayer.add(tara);
        this.tara = tara;

        this._spawnKavi();
        this._attachMirrorLabels(
            this.kavi,
            "Tiny brave thing",
            "Afraid of being left behind",
            -18
        );
        this.kavi.deeperText =
            "Every companion I have had eventually walked on without me.";

        const shardData = [
            {
                x: 0.52,
                surface: "Old joke",
                hidden: "Fear hidden as cleverness",
                deep: "I joke first so no one hears how scared I am.",
            },
            {
                x: 0.68,
                surface: "Small silence",
                hidden: "An unnamed goodbye",
                deep: "Someone left before I knew how to ask them to stay.",
            },
            {
                x: 0.84,
                surface: "Bright mask",
                hidden: "A wish to be chosen",
                deep: "I shine so brightly because I am afraid I will be missed.",
            },
        ];

        shardData.forEach((data, idx) => {
            const shard = this.add.container(W * data.x, H - 86);
            const ring = this.add.circle(0, 0, 16, 0xfadb5f, 0);
            ring.setStrokeStyle(1, 0xfadb5f, 0.55);
            ring.setBlendMode(Phaser.BlendModes.ADD);
            const gem = this.add.graphics();
            gem.fillStyle(0xfadb5f, 0.75);
            gem.fillPoints(
                [
                    { x: 0, y: -10 },
                    { x: 10, y: 0 },
                    { x: 0, y: 10 },
                    { x: -10, y: 0 },
                ],
                true
            );
            gem.setBlendMode(Phaser.BlendModes.ADD);
            this.tweens.add({
                targets: ring,
                scale: { from: 0.7, to: 1.5 },
                alpha: { from: 0.8, to: 0.08 },
                duration: 1500 + idx * 120,
                repeat: -1,
                ease: "sine.out",
            });
            shard.add([ring, gem]);
            shard.kind = "memory-shard";
            shard.collected = false;
            shard.deeperText = data.deep;
            this._attachMirrorLabels(shard, data.surface, data.hidden, -34);
            this.worldLayer.add(shard);
            this.memoryShards.push(shard);
        });

        this._showNarration(
            "Tara stands at the edge of the second world, holding something small enough to fit in a palm and large enough to undo every lie you have ever told yourself."
        );
        this._emitChapter7Progress();
        this._afterDialogue = () => {
            gameEvents.emit("script:start", { name: "tara-lens-dialogue" });
            this._afterDialogue = () => {
                this.helperPhase = "kavi-practice";
                this._emitChapter7Progress();
                gameEvents.emit(
                    "hud:hint",
                    "Turn Mirror on near Kavi, then press Space to see deeper."
                );
            };
        };
    }

    // ------------------------------------------------------------------
    // Chapter 8: Road of Trials - answer three small fires with tenderness
    // ------------------------------------------------------------------
    _setupChapter8() {
        this.trialFires = [];
        this.centralFlameOpen = false;
        this.centralFlameHintShown = false;

        this._spawnKavi();

        TRIAL_FIRES.forEach((data, idx) => {
            const fire = this.add.container(W * data.x, H - 92);
            const glow = this.add.circle(0, -8, 26, 0xfb8500, 0.16);
            glow.setBlendMode(Phaser.BlendModes.ADD);
            const core = this.add.graphics();
            core.fillStyle(0xfb8500, 0.9);
            core.fillTriangle(-9, 0, 9, 0, 0, -32);
            core.fillStyle(0xfadb5f, 0.9);
            core.fillTriangle(-5, 0, 5, 0, 0, -21);
            const embers = this.add.circle(0, 3, 12, 0xd4af37, 0.22);
            embers.setBlendMode(Phaser.BlendModes.ADD);

            if (data.id === "stranger") {
                const figure = this.add.graphics();
                figure.fillStyle(0x1c1c22, 0.75);
                figure.fillRoundedRect(-31, -28, 14, 28, 3);
                figure.fillCircle(-24, -35, 6);
                fire.add(figure);
            }
            if (data.id === "self") {
                const pool = this.add.graphics();
                pool.fillStyle(0x10172a, 0.65);
                pool.fillEllipse(0, 18, 58, 14);
                pool.lineStyle(1, 0xfadb5f, 0.2);
                pool.strokeEllipse(0, 18, 58, 14);
                fire.add(pool);
            }

            this.tweens.add({
                targets: glow,
                scale: { from: 0.75, to: 1.25 },
                alpha: { from: 0.12, to: 0.28 },
                duration: 1200 + idx * 180,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut",
            });

            fire.add([glow, embers, core]);
            fire.kind = "trial-fire";
            fire.fireId = data.id;
            fire.completed = false;
            fire.glow = glow;
            fire.core = core;
            this._attachMirrorLabels(
                fire,
                data.surfaceLabel,
                data.hiddenLabel,
                -54
            );
            this.worldLayer.add(fire);
            this.trialFires.push(fire);
        });

        const central = this.add.container(W * 0.91, H - 92);
        const halo = this.add.circle(0, -18, 38, 0xfadb5f, 0.04);
        halo.setBlendMode(Phaser.BlendModes.ADD);
        const flame = this.add.graphics();
        flame.fillStyle(0xfb8500, 0.35);
        flame.fillTriangle(-16, 0, 16, 0, 0, -48);
        flame.fillStyle(0xfadb5f, 0.25);
        flame.fillTriangle(-9, 0, 9, 0, 0, -34);
        central.add([halo, flame]);
        central.kind = "central-flame";
        central.setAlpha(0.35);
        central.halo = halo;
        this._attachMirrorLabels(
            central,
            "Central flame",
            "Tenderness becomes passage",
            -66
        );
        this.worldLayer.add(central);
        this.centralFlame = central;

        this._showNarration(
            "The road between worlds is lit by small fires. Each one asks a question. Each question is a door."
        );
        this._afterDialogue = () => {
            gameEvents.emit("script:start", { name: "trial-opening" });
            this._afterDialogue = () => {
                this._emitChapter8Progress();
                gameEvents.emit(
                    "hud:hint",
                    "Face each fire. Use Mirror to read its hidden truth, then press Space."
                );
            };
        };
        this._emitChapter8Progress();
    }

    // ------------------------------------------------------------------
    // Chapter 9: Night Sea Journey - breathe with grief and listen
    // ------------------------------------------------------------------
    _setupChapter9() {
        this.memoryBuoys = [];
        this.breathT = 0;
        this.breathPeriod = 4;
        this.stillnessPoints = 0;
        this.lastStillnessExhale = -1;
        this.shoreOpen = false;
        this.shoreDialogueStarted = false;
        this.seaMidlineSpoken = false;

        this._spawnKavi();
        this.kavi.setAlpha(0.28);

        MEMORY_BUOYS.forEach((data, idx) => {
            const buoy = this.add.container(W * data.x, H - 132 + (idx % 2) * 18);
            const halo = this.add.circle(0, 0, 24, data.color, 0.16);
            halo.setBlendMode(Phaser.BlendModes.ADD);
            const core = this.add.circle(0, 0, 7, data.color, 0.88);
            core.setBlendMode(Phaser.BlendModes.ADD);
            const reflection = this.add.ellipse(0, 34, 24, 6, data.color, 0.18);
            reflection.setBlendMode(Phaser.BlendModes.ADD);
            this.tweens.add({
                targets: buoy,
                y: buoy.y - 8,
                duration: 1500 + idx * 160,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut",
            });
            this.tweens.add({
                targets: halo,
                scale: { from: 0.75, to: 1.35 },
                alpha: { from: 0.12, to: 0.28 },
                duration: 1300 + idx * 120,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut",
            });
            buoy.add([reflection, halo, core]);
            buoy.kind = "memory-buoy";
            buoy.buoyId = data.id;
            buoy.heard = false;
            buoy.color = data.color;
            this._attachMirrorLabels(
                buoy,
                data.surfaceLabel,
                data.hiddenLabel,
                -42
            );
            this.worldLayer.add(buoy);
            this.memoryBuoys.push(buoy);
        });

        const shore = this.add.container(W - 44, H - 108);
        const sand = this.add.graphics();
        sand.fillStyle(0xfadb5f, 0.16);
        sand.fillEllipse(0, 18, 94, 42);
        sand.fillStyle(0xfef3c7, 0.12);
        sand.fillEllipse(10, 6, 64, 22);
        const glow = this.add.circle(0, 0, 44, 0xfadb5f, 0.04);
        glow.setBlendMode(Phaser.BlendModes.ADD);
        shore.add([glow, sand]);
        shore.setAlpha(0.18);
        shore.kind = "far-shore";
        shore.glow = glow;
        this._attachMirrorLabels(shore, "Far shore", "Breathable grief", -42);
        this.worldLayer.add(shore);
        this.farShore = shore;

        this.breathRing = this.add.graphics();
        this.breathRing.setDepth(25);
        this.breathText = this.add.text(W / 2, H - 40, "inhale", {
            fontFamily: "Outfit, sans-serif",
            fontSize: "10px",
            color: "#fadb5f",
            align: "center",
        });
        this.breathText.setOrigin(0.5);
        this.breathText.setDepth(26);
        this.foreLayer.add([this.breathRing, this.breathText]);

        this._showNarration(
            "There is a sea that does not drown. You must cross it not by swimming, but by breathing."
        );
        this._afterDialogue = () => {
            gameEvents.emit("script:start", { name: "sea-opening" });
            this._afterDialogue = () => {
                this._emitChapter9Progress();
                gameEvents.emit(
                    "hud:hint",
                    "Cross the night sea. Listen to buoys with Mirror, and pause during exhale."
                );
            };
        };
        this._emitChapter9Progress();
    }

    // ------------------------------------------------------------------
    // Chapter 10: Adventure - meet four helpers and cross the bridge
    // ------------------------------------------------------------------
    _setupChapter10() {
        this.riverHelpers = [];
        this.bridgeOpen = false;
        this.bridgeDialogueStarted = false;

        this._spawnKavi();

        RIVER_HELPERS.forEach((data) => {
            const helper = this._makeNpc(W * data.x, H - 112, data.name, {
                surfaceLabel: data.title,
                hiddenLabel: data.hiddenLabel,
            });
            const gift = this.add.circle(14, -24, 5, data.color, 0.92);
            gift.setBlendMode(Phaser.BlendModes.ADD);
            const giftGlow = this.add.circle(14, -24, 18, data.color, 0.16);
            giftGlow.setBlendMode(Phaser.BlendModes.ADD);
            helper.add([giftGlow, gift]);
            helper.helperId = data.id;
            helper.met = false;
            helper.giftColor = data.color;
            helper.kind = "river-helper";
            this.worldLayer.add(helper);
            this.riverHelpers.push(helper);
        });

        const bridge = this.add.container(W - 58, H - 108);
        const stones = this.add.graphics();
        stones.fillStyle(0x475569, 0.52);
        for (let i = 0; i < 4; i++) {
            stones.fillRoundedRect(-54 + i * 24, -4 - i * 2, 20, 12, 3);
        }
        const missing = this.add.graphics();
        missing.lineStyle(1, 0xfadb5f, 0.2);
        missing.strokeRoundedRect(38, -12, 20, 12, 3);
        const glow = this.add.circle(24, -8, 36, 0xfadb5f, 0.03);
        glow.setBlendMode(Phaser.BlendModes.ADD);
        bridge.add([glow, stones, missing]);
        bridge.setAlpha(0.38);
        bridge.kind = "river-bridge";
        bridge.glow = glow;
        this._attachMirrorLabels(
            bridge,
            "Half-built bridge",
            "Connection becomes crossing",
            -48
        );
        this.worldLayer.add(bridge);
        this.riverBridge = bridge;

        this._showNarration(
            "Beyond the sea, a river runs. Along its banks, four figures sit as if they have been waiting for someone."
        );
        this._afterDialogue = () => {
            gameEvents.emit("script:start", { name: "river-opening" });
            this._afterDialogue = () => {
                this._emitChapter10Progress();
                gameEvents.emit(
                    "hud:hint",
                    "Meet the four helpers. Mirror reveals what each helper carries."
                );
            };
        };
        this._emitChapter10Progress();
    }

    // ------------------------------------------------------------------
    // Chapter 11: The Chamber of Stones - name what the light has been keeping
    // ------------------------------------------------------------------
    _setupChapter11() {
        this.initiationStones = [];
        this.voiceWellOpen = false;
        this.initiationClosingStarted = false;

        this._spawnKavi();

        INITIATION_STONES.forEach((data, idx) => {
            const stone = this.add.container(W * data.x, H - 96);
            const slab = this.add.graphics();
            slab.fillStyle(data.color || 0x1f1b24, 0.72);
            slab.fillRoundedRect(
                -data.width / 2,
                -data.height,
                data.width,
                data.height,
                6
            );
            slab.lineStyle(1, 0xfadb5f, 0.32);
            slab.strokeRoundedRect(
                -data.width / 2,
                -data.height,
                data.width,
                data.height,
                6
            );
            const rune = this.add.text(0, -24, String(idx + 1), {
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "18px",
                color: "#fadb5f",
            });
            rune.setOrigin(0.5);
            const glow = this.add.circle(0, -20, 22, 0xfadb5f, 0.06);
            glow.setBlendMode(Phaser.BlendModes.ADD);
            stone.add([glow, slab, rune]);
            stone.kind = "initiation-stone";
            stone.stoneId = data.id;
            stone.named = false;
            stone.glow = glow;
            stone.deeperText = data.deeperLabel;
            this._attachMirrorLabels(stone, data.surfaceLabel, data.hiddenLabel, -54);
            this.worldLayer.add(stone);
            this.initiationStones.push(stone);
        });

        const well = this.add.container(W * 0.5, H - 98);
        const bowl = this.add.graphics();
        bowl.fillStyle(0x0f172a, 0.75);
        bowl.fillEllipse(0, 0, 72, 28);
        bowl.lineStyle(1, 0xfadb5f, 0.32);
        bowl.strokeEllipse(0, 0, 72, 28);
        const light = this.add.circle(0, -4, 26, 0xfadb5f, 0.04);
        light.setBlendMode(Phaser.BlendModes.ADD);
        well.add([light, bowl]);
        well.setAlpha(0.28);
        well.kind = "voice-well";
        well.light = light;
        this._attachMirrorLabels(well, "Silent well", "Names become voice", -44);
        this.worldLayer.add(well);
        this.voiceWell = well;

        this._showNarration(
            "The lantern is full now. It does not need more light. But light that is full becomes a room."
        );
        this._afterDialogue = () => {
            gameEvents.emit("script:start", { name: "initiation-opening" });
            this._afterDialogue = () => {
                this._emitChapter11Progress();
                gameEvents.emit(
                    "hud:hint",
                    "Name the four stones with the Mirror Lens."
                );
            };
        };
        this._emitChapter11Progress();
    }

    // ------------------------------------------------------------------
    // Chapter 12: The Inward Threshold - cross the mist that turns inward
    // ------------------------------------------------------------------
    _setupChapter12() {
        this.inwardMistStrength = 1.05;
        this.inwardArrivalStarted = false;
        this.inwardMarkers = [];
        this._spawnKavi();

        INWARD_THRESHOLD_MARKERS.forEach((data, idx) => {
            const marker = this.add.container(W * data.x, H - 76);
            const glow = this.add.circle(0, 0, 18, 0xfadb5f, 0.12);
            glow.setBlendMode(Phaser.BlendModes.ADD);
            const sigil = this.add.graphics();
            sigil.lineStyle(1, 0xfadb5f, 0.55);
            sigil.strokeCircle(0, 0, 12);
            sigil.strokeTriangle(-7, 5, 7, 5, 0, -9);
            const num = this.add.text(0, 19, String(idx + 1), {
                fontFamily: "Outfit, sans-serif",
                fontSize: "10px",
                color: "#fadb5f",
            });
            num.setOrigin(0.5);
            marker.add([glow, sigil, num]);
            marker.reached = false;
            marker.markerText = data.text;
            marker.glow = glow;
            this.tweens.add({
                targets: glow,
                alpha: { from: 0.05, to: 0.28 },
                scale: { from: 0.8, to: 1.35 },
                duration: 1700 + idx * 240,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut",
            });
            this.worldLayer.add(marker);
            this.inwardMarkers.push(marker);
        });

        const gate = this.add.container(W - 58, H - 108);
        const arch = this.add.graphics();
        arch.lineStyle(2, 0xe2e8f0, 0.55);
        arch.strokeRoundedRect(-22, -62, 44, 62, 20);
        arch.fillStyle(0xfadb5f, 0.08);
        arch.fillRoundedRect(-22, -62, 44, 62, 20);
        const core = this.add.circle(0, -30, 18, 0xfadb5f, 0.16);
        core.setBlendMode(Phaser.BlendModes.ADD);
        gate.add([core, arch]);
        gate.kind = "inward-gate";
        gate.core = core;
        this.worldLayer.add(gate);
        this.inwardGate = gate;

        this._showNarration(
            "The outer journey is done. Every gate, every sea, every helper along the river. But there is one threshold no one else can see."
        );
        this._afterDialogue = () => {
            gameEvents.emit("script:start", { name: "inward-threshold-opening" });
            this._afterDialogue = () => {
                this._emitChapter12Progress();
                gameEvents.emit(
                    "hud:hint",
                    "Hold right through the silver mist. Pause at each lantern marker."
                );
            };
        };
        this._emitChapter12Progress();
    }

    // ------------------------------------------------------------------
    // Chapter 13: Apotheosis - a brief moment of vastness
    // ------------------------------------------------------------------
    _setupChapter13() {
        this._spawnKavi();
        this.hero.x = W * 0.5;
        this.hero.y = H - 118;
        if (this.heroLanternHalo) {
            this.tweens.add({
                targets: this.heroLanternHalo,
                scale: { from: 1.2, to: 2.8 },
                alpha: { from: 0.22, to: 0.5 },
                duration: 2600,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut",
            });
        }
        gameEvents.emit("chapter:progress", {
            objective: "Experience the vastness.",
            detail: "Advance the dialogue and let the lanterns answer.",
            phase: "Lantern field",
        });
        this.time.delayedCall(600, () => {
            this._afterDialogue = () => this._completeChapter();
            gameEvents.emit("script:start", { name: "apotheosis-dialogue" });
        });
    }

    _spawnKavi() {
        if (this.kaviSpawned) return;
        this.kaviSpawned = true;
        const kavi = this.add.container(this.hero.x + 30, this.hero.y - 28);
        const core = this.add.circle(0, 0, 3, 0xfadb5f, 1);
        core.setBlendMode(Phaser.BlendModes.ADD);
        const halo = this.add.circle(0, 0, 10, 0xfadb5f, 0.45);
        halo.setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({
            targets: halo,
            scale: { from: 0.6, to: 1.4 },
            alpha: { from: 0.5, to: 0.15 },
            duration: 900,
            yoyo: true,
            repeat: -1,
        });
        kavi.add([halo, core]);
        this.fxLayer.add(kavi);
        this.kavi = kavi;
        // Set a bob target
        this.kaviPhase = 0;
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------
    _attachMirrorLabels(cont, surfaceText, hiddenText, yOffset = -36) {
        const surface = this.add.text(0, yOffset, surfaceText, {
            fontFamily: "Outfit, sans-serif",
            fontSize: "10px",
            color: "#9a9a9a",
            fontStyle: "italic",
        });
        surface.setOrigin(0.5, 1).setAlpha(0.7);
        const hidden = this.add.text(0, yOffset, hiddenText, {
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "14px",
            color: "#fadb5f",
            fontStyle: "italic",
        });
        hidden.setOrigin(0.5, 1).setAlpha(0).setBlendMode(Phaser.BlendModes.ADD);
        hidden._baseY = yOffset;
        const halo = this.add.circle(0, yOffset - 6, 22, 0xfadb5f, 0);
        halo.setBlendMode(Phaser.BlendModes.ADD);
        cont.add([halo, surface, hidden]);
        cont.surfaceLabel = surface;
        cont.hiddenLabel = hidden;
        cont.mirrorHalo = halo;
    }

    _makeNpc(x, y, label, labels = {}) {
        const cont = this.add.container(x, y);
        const body = this.add.graphics();
        body.fillStyle(0x222222, 1);
        body.fillRoundedRect(-9, -34, 18, 34, 3);
        body.fillCircle(0, -42, 7);
        body.fillRect(-9, 0, 5, 16);
        body.fillRect(4, 0, 5, 16);
        const dimLantern = this.add.circle(0, -22, 2.5, 0x8a7a3a, 0.6);
        cont.add([body, dimLantern]);
        cont.label = label;

        // Surface label (visible by default — dim grey, slightly italic feel)
        const surface = this.add.text(0, -68, labels.surfaceLabel || "", {
            fontFamily: "Outfit, sans-serif",
            fontSize: "11px",
            color: "#9a9a9a",
            fontStyle: "italic",
            align: "center",
        });
        surface.setOrigin(0.5, 1);
        surface.setAlpha(0.85);

        // Hidden label (visible only when Mirror Lens is active — golden, brighter)
        const hidden = this.add.text(0, -68, labels.hiddenLabel || "", {
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "16px",
            color: "#fadb5f",
            fontStyle: "italic",
            align: "center",
        });
        hidden.setOrigin(0.5, 1);
        hidden.setAlpha(0);
        hidden.setBlendMode(Phaser.BlendModes.ADD);
        hidden._baseY = -68;

        // Mirror halo behind hidden label
        const halo = this.add.circle(0, -50, 30, 0xfadb5f, 0);
        halo.setBlendMode(Phaser.BlendModes.ADD);

        cont.add([halo, surface, hidden]);
        cont.surfaceLabel = surface;
        cont.hiddenLabel = hidden;
        cont.mirrorHalo = halo;
        return cont;
    }

    _showNarration(text) {
        // Defer to next frame so React event listeners are subscribed first
        this.time.delayedCall(60, () => {
            gameEvents.emit("dialogue:open", {
                speaker: null,
                text,
                kind: "narration",
            });
        });
    }

    _refreshMirror() {
        const active = this.mirrorActive;

        // Lantern aura intensifies when mirror is on
        if (this.heroLanternHalo)
            this.heroLanternHalo.setAlpha(active ? 0.45 : 0.2);

        // Reveal hidden labels on every NPC, object, or pulse with mirror data
        const targets = [
            ...(this.citizens || []),
            ...(this.pulses || []),
            ...(this.trailPulses || []),
            ...(this.thresholdAnchors || []).filter((a) => !a.collected),
            ...(this.memoryShards || []).filter((s) => !s.collected),
            ...(this.trialFires || []).filter((f) => !f.completed),
            ...(this.memoryBuoys || []).filter((b) => !b.heard),
            ...(this.riverHelpers || []).filter((h) => !h.met),
            ...(this.initiationStones || []).filter((s) => !s.named),
            this.tara,
            this.mural,
            this.shadowTwin,
            this.secondGate,
            this.kavi,
            this.centralFlame,
            this.farShore,
            this.riverBridge,
            this.voiceWell,
        ].filter(Boolean);

        targets.forEach((t) => {
            if (!t.surfaceLabel || !t.hiddenLabel) return;
            this.tweens.killTweensOf([
                t.surfaceLabel,
                t.hiddenLabel,
                t.mirrorHalo,
            ]);
            this.tweens.add({
                targets: t.surfaceLabel,
                alpha: active ? 0 : 0.85,
                duration: 350,
                ease: "sine.out",
            });
            this.tweens.add({
                targets: t.hiddenLabel,
                alpha: active ? 1 : 0,
                y: active
                    ? (t.hiddenLabel._baseY || t.hiddenLabel.y) - 10
                    : t.hiddenLabel._baseY || t.hiddenLabel.y,
                duration: 500,
                ease: "sine.out",
            });
            this.tweens.add({
                targets: t.mirrorHalo,
                alpha: active ? 0.35 : 0,
                scale: active ? 1.2 : 0.6,
                duration: 500,
                ease: "sine.out",
            });
        });
    }

    _findNearestInteractable() {
        const candidates = [];
        if (this.chapterId === 1) {
            (this.citizens || [])
                .filter((c) => !c.spoken)
                .forEach((c) =>
                    candidates.push({
                        target: c,
                        range: 60,
                        label: "Listen",
                    })
                );
            (this.pulses || [])
                .filter((p) => !p.collected)
                .forEach((p) =>
                    candidates.push({
                        target: p,
                        range: 50,
                        label: "Collect heartbeat",
                    })
                );
        } else if (this.chapterId === 2) {
            (this.trailPulses || [])
                .filter((p) => p.active && !p.collected)
                .forEach((p) =>
                    candidates.push({
                        target: p,
                        range: 60,
                        label: "Collect echo",
                    })
                );
            if (this.mural && !this.mural.spoken) {
                candidates.push({
                    target: this.mural,
                    range: 70,
                    label: "Listen to mural",
                });
            }
        } else if (this.chapterId === 6) {
            (this.thresholdAnchors || [])
                .filter((a) => !a.collected)
                .forEach((a) =>
                    candidates.push({
                        target: a,
                        range: 58,
                        label: "Take vow",
                    })
                );
        } else if (this.chapterId === 7) {
            if (this.helperPhase === "kavi-practice" && this.kavi) {
                candidates.push({
                    target: this.kavi,
                    range: 86,
                    label: "See Kavi",
                });
            }
            if (this.helperPhase === "shards") {
                (this.memoryShards || [])
                    .filter((s) => !s.collected)
                    .forEach((s) =>
                        candidates.push({
                            target: s,
                            range: 62,
                            label: "See shard",
                        })
                    );
            }
        } else if (this.chapterId === 8) {
            (this.trialFires || [])
                .filter((f) => !f.completed)
                .forEach((f) =>
                    candidates.push({
                        target: f,
                        range: 64,
                        label: "Face fire",
                    })
                );
            if (this.centralFlameOpen && this.centralFlame) {
                candidates.push({
                    target: this.centralFlame,
                    range: 58,
                    label: "Enter flame",
                });
            }
        } else if (this.chapterId === 9) {
            (this.memoryBuoys || [])
                .filter((b) => !b.heard)
                .forEach((b) =>
                    candidates.push({
                        target: b,
                        range: 58,
                        label: "Listen",
                    })
                );
            if (this.shoreOpen && this.farShore) {
                candidates.push({
                    target: this.farShore,
                    range: 62,
                    label: "Reach shore",
                });
            }
        } else if (this.chapterId === 10) {
            (this.riverHelpers || [])
                .filter((h) => !h.met)
                .forEach((h) =>
                    candidates.push({
                        target: h,
                        range: 68,
                        label: "Receive gift",
                    })
                );
            if (this.bridgeOpen && this.riverBridge) {
                candidates.push({
                    target: this.riverBridge,
                    range: 64,
                    label: "Cross bridge",
                });
            }
        } else if (this.chapterId === 11) {
            (this.initiationStones || [])
                .filter((s) => !s.named)
                .forEach((s) =>
                    candidates.push({
                        target: s,
                        range: 62,
                        label: "Name it",
                    })
                );
            if (this.voiceWellOpen && this.voiceWell) {
                candidates.push({
                    target: this.voiceWell,
                    range: 66,
                    label: "Speak vow",
                });
            }
        }

        let nearest = null;
        for (const c of candidates) {
            const dist = Math.abs(c.target.x - this.hero.x);
            if (dist <= c.range && (!nearest || dist < nearest.dist)) {
                nearest = { ...c, dist };
            }
        }
        return nearest;
    }

    _setTargetFocus(target, active) {
        if (!target) return;
        const alpha = active ? 0.5 : this.mirrorActive ? 0.35 : 0;
        const scale = active ? 1.45 : this.mirrorActive ? 1.2 : 0.6;
        if (target.mirrorHalo) {
            target.mirrorHalo.setAlpha(alpha);
            target.mirrorHalo.setScale(scale);
        }
    }

    _updateInteractPrompt() {
        if (!this.interactPrompt || this.dialogueOpen || this.completed) {
            if (this.interactPrompt) this.interactPrompt.setAlpha(0);
            return;
        }

        const nearest = this._findNearestInteractable();
        if (this.nearPromptTarget && this.nearPromptTarget !== nearest?.target) {
            this._setTargetFocus(this.nearPromptTarget, false);
        }
        this.nearPromptTarget = nearest?.target || null;

        if (!nearest) {
            this.interactPrompt.setAlpha(0);
            return;
        }

        this._setTargetFocus(nearest.target, true);
        this.interactPromptLabel.setText(`Space / ${nearest.label}`);
        this.interactPrompt.x = nearest.target.x;
        this.interactPrompt.y = nearest.target.y - 86;
        this.interactPrompt.setAlpha(1);
    }

    _showNoTargetHint() {
        if (this.chapterId === 1) {
            gameEvents.emit(
                "hud:hint",
                "Move close to a citizen or glowing heartbeat, then press Space."
            );
        } else if (this.chapterId === 2) {
            const collected = this.trailPulses?.filter((p) => p.collected).length || 0;
            gameEvents.emit(
                "hud:hint",
                collected < 3
                    ? "Stand beside the brightest heartbeat pulse, then press Space."
                    : "Stand beside the mural at the far right, then press Space."
            );
        } else if (this.chapterId === 6) {
            const collected =
                this.thresholdAnchors?.filter((a) => a.collected).length || 0;
            gameEvents.emit(
                "hud:hint",
                collected < 3
                    ? "Stand beside a golden vow, then press Space."
                    : "The second gate is awake. Walk through it."
            );
        } else if (this.chapterId === 7) {
            if (!this.mirrorActive) {
                gameEvents.emit("hud:hint", "Turn Mirror on, then press Space near Kavi or a memory shard.");
            } else if (this.helperPhase === "kavi-practice") {
                gameEvents.emit("hud:hint", "Stand near Kavi and press Space to see what he hides.");
            } else if (this.helperPhase === "shards") {
                gameEvents.emit("hud:hint", "Find a golden memory shard and press Space while Mirror is on.");
            }
        } else if (this.chapterId === 8) {
            const completed = this.trialFires?.filter((f) => f.completed).length || 0;
            gameEvents.emit(
                "hud:hint",
                completed < 3
                    ? "Stand beside an unanswered fire and press Space. Mirror reveals what it is really asking."
                    : "The central flame is awake. Walk into it."
            );
        } else if (this.chapterId === 9) {
            const heard = this.memoryBuoys?.filter((b) => b.heard).length || 0;
            gameEvents.emit(
                "hud:hint",
                this.shoreOpen
                    ? "The far shore is visible. Walk right into the pale light."
                    : heard < 3
                      ? "Use Mirror near memory buoys, then press Space to listen."
                      : "Pause during exhale. Stillness accumulates; the sea notices."
            );
        } else if (this.chapterId === 10) {
            const met = this.riverHelpers?.filter((h) => h.met).length || 0;
            gameEvents.emit(
                "hud:hint",
                met < 4
                    ? "Stand beside a helper and press Space. Mirror reveals what they carry."
                    : "The bridge is complete. Cross it."
            );
        } else if (this.chapterId === 11) {
            const named =
                this.initiationStones?.filter((s) => s.named).length || 0;
            gameEvents.emit(
                "hud:hint",
                named < 4
                    ? "Stand beside an unnamed stone with Mirror on, then press Space."
                    : "The voice well is awake. Speak the names back to it."
            );
        }
    }

    _tryInteract() {
        if (this.dialogueOpen) return;
        if (this.chapterId === 1) {
            // Citizens
            for (const c of this.citizens) {
                if (Math.abs(c.x - this.hero.x) < 60 && !c.spoken) {
                    c.spoken = true;
                    gameEvents.emit("script:start", {
                        name: "citizen",
                        npcId: c.npcId,
                    });
                    this._afterDialogue = () => this._checkChapter1Progress();
                    return;
                }
            }
            // Pulses
            for (const p of this.pulses) {
                if (Math.abs(p.x - this.hero.x) < 50 && !p.collected) {
                    this._collectPulse(p);
                    return;
                }
            }
            this._showNoTargetHint();
        } else if (this.chapterId === 2) {
            const active = this.trailPulses.find((p) => p.active && !p.collected);
            if (active && Math.abs(active.x - this.hero.x) < 60) {
                this._collectTrail(active);
                return;
            }
            // Mural
            if (
                this.mural &&
                !this.mural.spoken &&
                Math.abs(this.mural.x - this.hero.x) < 70
            ) {
                this.mural.spoken = true;
                gameEvents.emit("script:start", { name: "mural-dialogue" });
                this._afterDialogue = () => this._completeChapter();
                return;
            }
            this._showNoTargetHint();
        } else if (this.chapterId === 6) {
            for (const anchor of this.thresholdAnchors || []) {
                if (Math.abs(anchor.x - this.hero.x) < 58 && !anchor.collected) {
                    this._collectThresholdAnchor(anchor);
                    return;
                }
            }
            this._showNoTargetHint();
        } else if (this.chapterId === 7) {
            if (this.helperPhase === "kavi-practice" && this.kavi) {
                if (Math.abs(this.kavi.x - this.hero.x) < 86) {
                    if (!this.mirrorActive) {
                        this._showNoTargetHint();
                        return;
                    }
                    this.kaviSeenDeep = true;
                    this.helperPhase = "shards";
                    this._revealDeepTruth(this.kavi, this.kavi.deeperText, -58);
                    gameEvents.emit("lantern:adjust", 0.08);
                    gameEvents.emit(
                        "hud:hint",
                        "Kavi's truth is visible. Find the three memory shards."
                    );
                    this._emitChapter7Progress();
                    return;
                }
            }

            if (this.helperPhase === "shards") {
                for (const shard of this.memoryShards || []) {
                    if (Math.abs(shard.x - this.hero.x) < 62 && !shard.collected) {
                        if (!this.mirrorActive) {
                            this._showNoTargetHint();
                            return;
                        }
                        this._collectMemoryShard(shard);
                        return;
                    }
                }
            }
            this._showNoTargetHint();
        } else if (this.chapterId === 8) {
            for (const fire of this.trialFires || []) {
                if (Math.abs(fire.x - this.hero.x) < 64 && !fire.completed) {
                    gameEvents.emit("script:start", {
                        name: "trial-fire",
                        fireId: fire.fireId,
                    });
                    return;
                }
            }
            if (
                this.centralFlameOpen &&
                this.centralFlame &&
                Math.abs(this.centralFlame.x - this.hero.x) < 58
            ) {
                this._completeChapter();
                return;
            }
            this._showNoTargetHint();
        } else if (this.chapterId === 9) {
            for (const buoy of this.memoryBuoys || []) {
                if (Math.abs(buoy.x - this.hero.x) < 58 && !buoy.heard) {
                    if (!this.mirrorActive) {
                        gameEvents.emit(
                            "hud:hint",
                            "Turn Mirror on beside the buoy, then press Space to listen."
                        );
                        return;
                    }
                    gameEvents.emit("script:start", {
                        name: "memory-buoy",
                        buoyId: buoy.buoyId,
                    });
                    this._afterDialogue = () => this._collectMemoryBuoy(buoy);
                    return;
                }
            }
            if (
                this.shoreOpen &&
                this.farShore &&
                Math.abs(this.farShore.x - this.hero.x) < 62
            ) {
                this._startSeaClosing();
                return;
            }
            this._showNoTargetHint();
        } else if (this.chapterId === 10) {
            for (const helper of this.riverHelpers || []) {
                if (Math.abs(helper.x - this.hero.x) < 68 && !helper.met) {
                    gameEvents.emit("script:start", {
                        name: "river-helper",
                        helperId: helper.helperId,
                    });
                    this._afterDialogue = () => this._completeRiverHelper(helper);
                    return;
                }
            }
            if (
                this.bridgeOpen &&
                this.riverBridge &&
                Math.abs(this.riverBridge.x - this.hero.x) < 64
            ) {
                this._startRiverClosing();
                return;
            }
            this._showNoTargetHint();
        } else if (this.chapterId === 11) {
            for (const stone of this.initiationStones || []) {
                if (Math.abs(stone.x - this.hero.x) < 62 && !stone.named) {
                    if (!this.mirrorActive) {
                        gameEvents.emit(
                            "hud:hint",
                            "Turn Mirror on beside the stone, then press Space to name it."
                        );
                        return;
                    }
                    gameEvents.emit("script:start", {
                        name: "initiation-stone",
                        stoneId: stone.stoneId,
                    });
                    this._afterDialogue = () => this._collectInitiationStone(stone);
                    return;
                }
            }
            if (
                this.voiceWellOpen &&
                this.voiceWell &&
                Math.abs(this.voiceWell.x - this.hero.x) < 66
            ) {
                this._startInitiationClosing();
                return;
            }
            this._showNoTargetHint();
        }
    }

    _collectPulse(p) {
        p.collected = true;
        this.tweens.add({
            targets: p,
            scale: 0,
            alpha: 0,
            duration: 600,
            onComplete: () => p.destroy(),
        });
        gameEvents.emit("fx:flicker");
        gameEvents.emit("lantern:adjust", 0.06);
        this._checkChapter1Progress();
    }

    _collectTrail(p) {
        p.collected = true;
        this.tweens.add({
            targets: p,
            scale: 0,
            alpha: 0,
            duration: 500,
            onComplete: () => p.destroy(),
        });
        gameEvents.emit("lantern:adjust", 0.08);
        this._colorBloom = Math.min(1, this._colorBloom + 0.34);
        gameEvents.emit("fx:bloom", this._colorBloom);

        // Activate next
        const next = this.trailPulses.find((tp) => !tp.collected && !tp.active);
        if (next) {
            next.active = true;
            this.tweens.add({ targets: next, alpha: 1, duration: 700 });
        } else {
            this.mural.active = true;
            this.tweens.add({
                targets: this.mural,
                alpha: { from: 1, to: 1 },
                duration: 100,
            });
            gameEvents.emit("hud:hint", "Approach the mural and listen.");
        }
        this._emitChapter2Progress();
    }

    _collectThresholdAnchor(anchor) {
        anchor.collected = true;
        this.tweens.add({
            targets: anchor,
            scale: 0,
            alpha: 0,
            duration: 520,
            onComplete: () => anchor.destroy(),
        });
        gameEvents.emit("lantern:adjust", 0.07);
        gameEvents.emit("fx:flicker");
        this._emitChapter6Progress();

        const allCollected = this.thresholdAnchors.every((a) => a.collected);
        if (allCollected && !this.thresholdGateOpen) {
            this.thresholdGateOpen = true;
            if (this.secondGateCore) {
                this.tweens.add({
                    targets: this.secondGateCore,
                    alpha: { from: 0.12, to: 0.55 },
                    scale: { from: 1, to: 2.2 },
                    duration: 900,
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut",
                });
            }
            gameEvents.emit(
                "hud:hint",
                "The second gate opens. Walk right and cross."
            );
        }
    }

    _revealDeepTruth(target, text, yOffset = -54) {
        if (!target || !text) return;
        if (target.deepLabel) {
            target.deepLabel.setText(text);
        } else {
            const label = this.add.text(0, yOffset, text, {
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "15px",
                color: "#fff2a6",
                fontStyle: "italic",
                align: "center",
                wordWrap: { width: 230 },
            });
            label.setOrigin(0.5, 1);
            label.setAlpha(0);
            label.setBlendMode(Phaser.BlendModes.ADD);
            target.add(label);
            target.deepLabel = label;
        }
        this.tweens.killTweensOf(target.deepLabel);
        this.tweens.add({
            targets: target.deepLabel,
            alpha: 1,
            y: yOffset - 8,
            duration: 420,
            ease: "sine.out",
        });
    }

    _collectMemoryShard(shard) {
        shard.collected = true;
        this.helperShardsCollected += 1;
        this._revealDeepTruth(shard, shard.deeperText, -58);
        this.tweens.add({
            targets: shard,
            alpha: 0,
            scale: 0.2,
            duration: 1500,
            delay: 900,
            ease: "sine.inOut",
            onComplete: () => shard.destroy(),
        });
        gameEvents.emit("lantern:adjust", 0.07);
        gameEvents.emit("fx:flicker");
        this._emitChapter7Progress();

        const allCollected = this.memoryShards.every((s) => s.collected);
        if (allCollected && !this.helperClosingStarted) {
            this.helperClosingStarted = true;
            this.helperPhase = "complete";
            this._emitChapter7Progress();
            gameEvents.emit(
                "hud:hint",
                "The Mirror steadies. Tara is ready to name what you learned."
            );
            this.time.delayedCall(1100, () => {
                this._afterDialogue = () => this._completeChapter();
                gameEvents.emit("script:start", { name: "tara-lens-closing" });
            });
        }
    }

    _handleTrialFireChoice(payload) {
        const fire = this.trialFires?.find((f) => f.fireId === payload.fireId);
        if (!fire) return;
        if (!payload.accepted) {
            this.tweens.add({
                targets: fire,
                scale: { from: 1, to: 0.94 },
                alpha: { from: 1, to: 0.72 },
                duration: 160,
                yoyo: true,
                ease: "sine.inOut",
            });
            return;
        }
        this._completeTrialFire(fire);
    }

    _completeTrialFire(fire) {
        if (!fire || fire.completed) return;
        fire.completed = true;
        if (fire.glow) {
            this.tweens.add({
                targets: fire.glow,
                alpha: { from: 0.28, to: 0.62 },
                scale: { from: 1.1, to: 1.8 },
                duration: 650,
                yoyo: true,
                repeat: 1,
                ease: "sine.inOut",
            });
        }
        this.tweens.add({
            targets: fire,
            y: fire.y - 6,
            duration: 360,
            yoyo: true,
            ease: "sine.inOut",
        });
        gameEvents.emit("fx:flicker");
        this._emitChapter8Progress();

        const allComplete = this.trialFires.every((f) => f.completed);
        if (allComplete && !this.centralFlameOpen) {
            this.centralFlameOpen = true;
            if (this.centralFlame) {
                this.tweens.add({
                    targets: this.centralFlame,
                    alpha: 1,
                    duration: 700,
                    ease: "sine.out",
                });
                if (this.centralFlame.halo) {
                    this.tweens.add({
                        targets: this.centralFlame.halo,
                        alpha: { from: 0.18, to: 0.55 },
                        scale: { from: 0.8, to: 1.8 },
                        duration: 1100,
                        yoyo: true,
                        repeat: -1,
                        ease: "sine.inOut",
                    });
                }
            }
            gameEvents.emit(
                "hud:hint",
                "All three fires answer. Walk into the central flame."
            );
            this._emitChapter8Progress();
        }
    }

    _collectMemoryBuoy(buoy) {
        if (!buoy || buoy.heard) return;
        buoy.heard = true;
        gameEvents.emit("lantern:adjust", 0.05);
        gameEvents.emit("fx:flicker");

        const mote = this.add.circle(buoy.x, buoy.y, 5, buoy.color || 0xfadb5f, 0.95);
        mote.setBlendMode(Phaser.BlendModes.ADD);
        this.fxLayer.add(mote);
        this.tweens.add({
            targets: mote,
            x: this.hero.x,
            y: this.hero.y - 22,
            scale: 0.2,
            alpha: 0,
            duration: 900,
            ease: "sine.inOut",
            onComplete: () => mote.destroy(),
        });
        this.tweens.add({
            targets: buoy,
            alpha: 0.28,
            scale: 0.7,
            duration: 700,
            ease: "sine.out",
        });

        const heard = this.memoryBuoys.filter((b) => b.heard).length;
        if (heard === 3 && !this.seaMidlineSpoken) {
            this.seaMidlineSpoken = true;
            gameEvents.emit("dialogue:open", {
                speaker: null,
                kind: "narration",
                text: "You are doing well. Stillness is not weakness here.",
            });
        }
        this._checkNightSeaReadiness();
        this._emitChapter9Progress();
    }

    _checkNightSeaReadiness() {
        if (!this.memoryBuoys) return;
        const heard = this.memoryBuoys.filter((b) => b.heard).length;
        if (heard >= 3 && this.stillnessPoints >= 5 && !this.shoreOpen) {
            this.shoreOpen = true;
            if (this.farShore) {
                this.tweens.add({
                    targets: this.farShore,
                    alpha: 1,
                    duration: 900,
                    ease: "sine.out",
                });
                if (this.farShore.glow) {
                    this.tweens.add({
                        targets: this.farShore.glow,
                        alpha: { from: 0.12, to: 0.5 },
                        scale: { from: 0.8, to: 1.8 },
                        duration: 1300,
                        yoyo: true,
                        repeat: -1,
                        ease: "sine.inOut",
                    });
                }
            }
            gameEvents.emit(
                "hud:hint",
                "The far shore appears. Walk right into the pale light."
            );
        }
    }

    _startSeaClosing() {
        if (this.shoreDialogueStarted || this.completed) return;
        this.shoreDialogueStarted = true;
        if (this.kavi) this.kavi.setAlpha(1);
        this._afterDialogue = () => this._completeChapter();
        gameEvents.emit("script:start", { name: "sea-closing" });
    }

    _completeRiverHelper(helper) {
        if (!helper || helper.met) return;
        helper.met = true;
        gameEvents.emit("lantern:adjust", 0.06);
        gameEvents.emit("fx:flicker");
        this.tweens.add({
            targets: helper,
            y: helper.y - 6,
            duration: 340,
            yoyo: true,
            ease: "sine.inOut",
        });

        const met = this.riverHelpers.filter((h) => h.met).length;
        if (met === 2) {
            gameEvents.emit("dialogue:open", {
                speaker: "Kavi",
                text: "They are all carrying something, aren't they? Even the helpers.",
            });
        }
        if (met === 4 && !this.bridgeOpen) {
            this.bridgeOpen = true;
            if (this.riverBridge) {
                this.tweens.add({
                    targets: this.riverBridge,
                    alpha: 1,
                    duration: 800,
                    ease: "sine.out",
                });
                if (this.riverBridge.glow) {
                    this.tweens.add({
                        targets: this.riverBridge.glow,
                        alpha: { from: 0.12, to: 0.48 },
                        scale: { from: 0.8, to: 1.7 },
                        duration: 1200,
                        yoyo: true,
                        repeat: -1,
                        ease: "sine.inOut",
                    });
                }
            }
            gameEvents.emit(
                "hud:hint",
                "Four gifts gather. The bridge completes. Walk right and cross."
            );
        }
        this._emitChapter10Progress();
    }

    _startRiverClosing() {
        if (this.bridgeDialogueStarted || this.completed) return;
        this.bridgeDialogueStarted = true;
        this._afterDialogue = () => this._completeChapter();
        gameEvents.emit("script:start", { name: "river-closing" });
    }

    _collectInitiationStone(stone) {
        if (!stone || stone.named) return;
        stone.named = true;
        gameEvents.emit("lantern:adjust", 0.02);
        gameEvents.emit("fx:flicker");
        this._revealDeepTruth(stone, stone.deeperText, -78);
        if (stone.glow) {
            this.tweens.add({
                targets: stone.glow,
                alpha: { from: 0.08, to: 0.42 },
                scale: { from: 1, to: 1.7 },
                duration: 520,
                yoyo: true,
                ease: "sine.inOut",
            });
        }
        this.tweens.add({
            targets: stone,
            y: stone.y - 8,
            duration: 360,
            yoyo: true,
            ease: "sine.inOut",
        });

        const named = this.initiationStones.filter((s) => s.named).length;
        if (named === 4 && !this.voiceWellOpen) {
            this.voiceWellOpen = true;
            if (this.voiceWell) {
                this.tweens.add({
                    targets: this.voiceWell,
                    alpha: 1,
                    duration: 700,
                    ease: "sine.out",
                });
                if (this.voiceWell.light) {
                    this.tweens.add({
                        targets: this.voiceWell.light,
                        alpha: { from: 0.16, to: 0.58 },
                        scale: { from: 0.7, to: 1.9 },
                        duration: 1200,
                        yoyo: true,
                        repeat: -1,
                        ease: "sine.inOut",
                    });
                }
            }
            gameEvents.emit(
                "hud:hint",
                "The well has heard every name. Step close and speak them back."
            );
        }
        this._emitChapter11Progress();
    }

    _startInitiationClosing() {
        if (this.initiationClosingStarted || this.completed) return;
        this.initiationClosingStarted = true;
        this._afterDialogue = () => this._completeChapter();
        gameEvents.emit("script:start", { name: "initiation-closing" });
    }

    _checkChapter1Progress() {
        const allSpoken = this.citizens.every((c) => c.spoken);
        const allPulses = this.pulses.every((p) => p.collected);
        this._emitChapter1Progress();
        if (allSpoken && allPulses && !this.completed) {
            this._completeChapter();
        } else if (allSpoken && !allPulses) {
            gameEvents.emit(
                "hud:hint",
                "Listen — three faint heartbeats hide in the city."
            );
        } else if (!allSpoken && allPulses) {
            gameEvents.emit(
                "hud:hint",
                "Some citizens have not yet been heard."
            );
        }
    }

    _completeChapter() {
        if (this.completed) return;
        this.completed = true;
        if (this.chapterId === 2) this._emitChapter2Progress();
        if (this.chapterId === 7) this._emitChapter7Progress();
        if (this.chapterId === 8) this._emitChapter8Progress();
        if (this.chapterId === 9) this._emitChapter9Progress();
        if (this.chapterId === 10) this._emitChapter10Progress();
        if (this.chapterId === 11) this._emitChapter11Progress();
        if (this.chapterId === 12) this._emitChapter12Progress();
        gameEvents.emit("chapter:complete", { chapterId: this.chapterId });
    }

    _emitChapter1Progress() {
        if (!this.citizens || !this.pulses) return;
        const spoken = this.citizens.filter((c) => c.spoken).length;
        const pulses = this.pulses.filter((p) => p.collected).length;
        gameEvents.emit("chapter:progress", {
            objective: "Listen to the city beneath its surface.",
            detail: "Speak with 3 citizens and collect 3 faint heartbeats. Toggle Mirror to reveal what each heart hides.",
            label: "heard",
            current: spoken + pulses,
            total: 6,
        });
    }

    _emitChapter2Progress() {
        if (!this.trailPulses) return;
        const collected = this.trailPulses.filter((p) => p.collected).length;
        const muralHeard = this.mural?.spoken ? 1 : 0;
        gameEvents.emit("chapter:progress", {
            objective:
                collected < 3 ? "Follow the heartbeat beneath the stone." : "Approach the mural and listen.",
            detail:
                collected < 3
                    ? "Collect the active golden pulse. Each pulse wakes the next one."
                    : "The mural at the far right is awake. Press Space beside it.",
            label: "echoes",
            current: collected + muralHeard,
            total: 4,
        });
    }

    _emitTraversalProgress(objective, detail, phase) {
        const start = W * 0.18;
        const end = W - 60;
        const raw = (this.hero.x - start) / Math.max(1, end - start);
        const bucket = Phaser.Math.Clamp(Math.floor(raw * 10), 0, 10);
        if (bucket === this.lastProgressBucket) return;
        this.lastProgressBucket = bucket;
        gameEvents.emit("chapter:progress", {
            objective,
            detail,
            label: "distance",
            current: bucket,
            total: 10,
            phase,
        });
    }

    _emitFearProgress() {
        if (!this.fearGate) return;
        const start = W * 0.18;
        const end = this.fearGate.x;
        const raw = (this.hero.x - start) / Math.max(1, end - start);
        const bucket = Phaser.Math.Clamp(Math.floor(raw * 10), 0, 10);
        const phase = this.fearSafe ? "Steady pulse — move" : "Fear stirs — pause";
        if (
            bucket === this.lastProgressBucket &&
            phase === this.lastFearPhase
        ) {
            return;
        }
        this.lastProgressBucket = bucket;
        this.lastFearPhase = phase;
        gameEvents.emit("chapter:progress", {
            objective: "Cross the fear field with presence.",
            detail: "Move only during the steady pulse. If the field turns dangerous, stop and breathe.",
            label: "threshold",
            current: bucket,
            total: 10,
            phase,
        });
    }

    _emitChapter6Progress() {
        if (!this.thresholdAnchors) return;
        const collected = this.thresholdAnchors.filter((a) => a.collected).length;
        const gateReached =
            this.thresholdGateOpen && this.secondGate
                ? Math.abs(this.secondGate.x - this.hero.x) < 48
                : false;
        gameEvents.emit("chapter:progress", {
            objective:
                collected < 3
                    ? "Gather the vows that open the second world."
                    : "Cross the second gate.",
            detail:
                collected < 3
                    ? "Use Mirror to read each vow beneath its surface, then press Space beside it."
                    : "The gate has answered. Walk right through the opening.",
            label: "vows",
            current: collected + (gateReached ? 1 : 0),
            total: 4,
            phase: this.thresholdGateOpen ? "Gate open" : "Between worlds",
        });
    }

    _emitChapter7Progress() {
        if (!this.memoryShards) return;
        const shardCount = this.memoryShards.filter((s) => s.collected).length;
        const kaviSeen = this.kaviSeenDeep ? 1 : 0;
        const current = this.helperPhase === "complete" ? 4 : kaviSeen + shardCount;
        let objective = "Learn the deeper Mirror Lens from Tara.";
        let detail = "Listen to Tara's teaching, then look at Kavi with the Mirror.";
        if (this.helperPhase === "kavi-practice") {
            objective = "See Kavi beneath the bright surface.";
            detail = "Turn Mirror on near Kavi, then press Space.";
        } else if (this.helperPhase === "shards") {
            objective = "Reveal the memory shards around Kavi's wound.";
            detail = "Keep Mirror on and press Space beside each golden shard.";
        } else if (this.helperPhase === "complete") {
            objective = "Receive the Mirror Lens as a true tool.";
            detail = "Tara names the lesson: clarity without judgment.";
        }
        gameEvents.emit("chapter:progress", {
            objective,
            detail,
            label: "truths",
            current,
            total: 4,
            phase:
                this.helperPhase === "complete"
                    ? "Clarity"
                    : this.helperPhase === "shards"
                      ? "Memory shards"
                      : "Mirror lesson",
        });
    }

    _emitChapter8Progress() {
        if (!this.trialFires) return;
        const completed = this.trialFires.filter((f) => f.completed).length;
        const atFlame =
            this.centralFlameOpen && this.centralFlame
                ? Math.abs(this.centralFlame.x - this.hero.x) < 58
                : false;
        gameEvents.emit("chapter:progress", {
            objective:
                completed < 3
                    ? "Face the three fires with tenderness."
                    : "Enter the central flame.",
            detail:
                completed < 3
                    ? "Use Mirror to see what each fire hides, then choose the compassionate response."
                    : "The fires have answered together. Walk into the central flame.",
            label: "fires",
            current: completed + (atFlame ? 1 : 0),
            total: 4,
            phase: this.centralFlameOpen ? "Central flame" : "Road of Trials",
        });
    }

    _emitChapter9Progress() {
        if (!this.memoryBuoys) return;
        const heard = this.memoryBuoys.filter((b) => b.heard).length;
        const stillness = Math.min(5, this.stillnessPoints || 0);
        const shoreReached =
            this.shoreOpen && this.farShore
                ? Math.abs(this.farShore.x - this.hero.x) < 62
                : false;
        const phase = this._isBreathInhale?.() ? "Inhale - move" : "Exhale - pause";
        gameEvents.emit("chapter:progress", {
            objective: this.shoreOpen
                ? "Step onto the far shore."
                : "Cross the night sea. Breathe with it.",
            detail: this.shoreOpen
                ? "The sea has become breathable. Walk right into the pale shore."
                : "Hear at least 3 memory buoys and earn 5 stillness points by pausing during exhale.",
            label: "sea",
            current: Math.min(10, heard + stillness + (shoreReached ? 2 : 0)),
            total: 10,
            phase,
        });
    }

    _emitChapter10Progress() {
        if (!this.riverHelpers) return;
        const met = this.riverHelpers.filter((h) => h.met).length;
        const atBridge =
            this.bridgeOpen && this.riverBridge
                ? Math.abs(this.riverBridge.x - this.hero.x) < 64
                : false;
        gameEvents.emit("chapter:progress", {
            objective:
                met < 4 ? "Meet the four helpers along the river." : "Cross the completed bridge.",
            detail:
                met < 4
                    ? "Use Mirror to see what each helper carries, then receive their gift."
                    : "The helpers have gathered. Walk right to cross the bridge.",
            label: "helpers",
            current: met + (atBridge ? 1 : 0),
            total: 5,
            phase: this.bridgeOpen ? "Bridge complete" : "Riverbank",
        });
    }

    _emitChapter11Progress() {
        if (!this.initiationStones) return;
        const named = this.initiationStones.filter((s) => s.named).length;
        const atWell =
            this.voiceWellOpen && this.voiceWell
                ? Math.abs(this.voiceWell.x - this.hero.x) < 66
                : false;
        gameEvents.emit("chapter:progress", {
            objective:
                named < 4
                    ? "Name the four stones with the Mirror Lens."
                    : "Speak the names into the Well.",
            detail:
                named < 4
                    ? "Each stone has a surface story and a hidden name. Use Mirror, then press Space."
                    : "The well is awake. Stand beside it and press Space.",
            label: "names",
            current: named + (atWell ? 1 : 0),
            total: 5,
            phase: this.voiceWellOpen ? "Voice well" : "Naming chamber",
        });
    }

    _emitChapter12Progress() {
        if (!this.inwardMarkers || !this.inwardGate) return;
        const reached = this.inwardMarkers.filter((m) => m.reached).length;
        const start = W * 0.18;
        const end = this.inwardGate.x;
        const raw = (this.hero.x - start) / Math.max(1, end - start);
        const distance = Phaser.Math.Clamp(Math.floor(raw * 10), 0, 10);
        gameEvents.emit("chapter:progress", {
            objective: "Cross the inward threshold.",
            detail:
                reached < 3
                    ? "Hold right through the silver mist. The markers will speak when you reach them."
                    : "The final opening is ahead. Keep carrying the lantern inward.",
            label: "markers",
            current: Math.min(10, Math.max(distance, reached * 3)),
            total: 10,
            phase: reached < 3 ? `Marker ${reached}/3` : "Inward gate",
        });
    }

    _isBreathInhale() {
        const period = this.breathPeriod || 4;
        const phase = ((this.breathT || 0) % period) / period;
        return phase < 0.5;
    }

    _updateBreathRing(moving, canMove) {
        if (!this.breathRing || !this.breathText) return;
        const period = this.breathPeriod || 4;
        const phase = ((this.breathT || 0) % period) / period;
        const inhale = phase < 0.5;
        const local = inhale ? phase / 0.5 : (phase - 0.5) / 0.5;
        const radius = inhale ? 14 + local * 19 : 33 - local * 19;

        this.breathRing.clear();
        this.breathRing.lineStyle(1, inhale ? 0xfadb5f : 0x93c5fd, 0.72);
        this.breathRing.strokeCircle(W / 2, H - 46, radius);
        this.breathRing.fillStyle(inhale ? 0xfadb5f : 0x93c5fd, 0.04);
        this.breathRing.fillCircle(W / 2, H - 46, radius);
        this.breathText.setText(
            `${inhale ? "inhale" : "exhale"} · stillness ${Math.min(
                5,
                this.stillnessPoints || 0
            )}/5`
        );

        if (!inhale && canMove && !moving && !this.completed) {
            const exhaleIndex = Math.floor((this.breathT || 0) / period);
            if (
                exhaleIndex !== this.lastStillnessExhale &&
                (this.stillnessPoints || 0) < 5
            ) {
                this.lastStillnessExhale = exhaleIndex;
                this.stillnessPoints += 1;
                gameEvents.emit("lantern:adjust", 0.025);
                gameEvents.emit(
                    "hud:hint",
                    "Stillness accumulates. The sea notices."
                );
                this._checkNightSeaReadiness();
                this._emitChapter9Progress();
            }
        }
    }

    // ------------------------------------------------------------------
    // Update loop
    // ------------------------------------------------------------------
    update(time, delta) {
        const dt = delta / 1000;
        const speed = HERO_SPEED;
        let vx = 0;
        let vy = 0;

        const leftDown =
            this.cursors.left.isDown || this.keyA.isDown || this.mobileInput.left;
        const rightDown =
            this.cursors.right.isDown ||
            this.keyD.isDown ||
            this.mobileInput.right;
        const upDown =
            this.cursors.up.isDown || this.keyW.isDown || this.mobileInput.up;
        const downDown =
            this.cursors.down.isDown ||
            this.keyS.isDown ||
            this.mobileInput.down;

        const canMove =
            !this.dialogueOpen &&
            !this.completed &&
            !(this.chapterId === 3 || this.chapterId === 13); // dialogue only chapters

        if (canMove) {
            if (leftDown) vx -= 1;
            if (rightDown) vx += 1;
            if (upDown) vy -= 1;
            if (downDown) vy += 1;
            if (vx !== 0 || vy !== 0) {
                const mag = Math.hypot(vx, vy) || 1;
                vx = (vx / mag) * speed * dt;
                vy = (vy / mag) * speed * dt;
            }
        }

        if (this.chapterId === 9) {
            this.breathT += dt;
            const moving = vx !== 0 || vy !== 0;
            if (!this._isBreathInhale()) {
                vx *= 0.48;
                vy *= 0.48;
            }
            this._updateBreathRing(moving, canMove);
        }

        // Chapter 4: fog pulls hero back (left) on top of input
        if (this.chapterId === 4 && canMove) {
            const fogPull = 0.4 * this.fogStrength * speed * dt;
            vx -= fogPull;
            // Fog weakens as you progress right
            this.fogStrength = Phaser.Math.Clamp(
                1.0 - (this.hero.x - W * 0.18) / (W * 0.7),
                0.1,
                1.0
            );

            // Reached gate
            if (
                this.gate &&
                !this.completed &&
                Math.abs(this.gate.x - this.hero.x) < 40
            ) {
                this._completeChapter();
            }
            if (!this.completed) {
                this._emitTraversalProgress(
                    "Follow Kavi beyond the city.",
                    "Hold right through the fog until you reach the threshold gate.",
                    "Open road"
                );
            }
        }

        // Chapter 5: pulse cycle + shadow waves
        if (this.chapterId === 5) {
            this.fearCycleT += dt;
            const period = 3.2; // total cycle
            const phase = (this.fearCycleT % period) / period;
            // First 55% safe (pulse steady), last 45% danger
            const wasSafe = this.fearSafe;
            this.fearSafe = phase < 0.55;
            if (wasSafe !== this.fearSafe) {
                gameEvents.emit("fear:phase", { safe: this.fearSafe });
            }

            if (this.fearTrialActive && canMove) {
                if (!this.fearSafe) {
                    // Movement during danger pushes hero back
                    if (vx !== 0 || vy !== 0) {
                        vx = -Math.abs(vx) * 0.6;
                        gameEvents.emit("lantern:adjust", -0.005);
                    }
                }
                // Shadow waves periodically spawn during danger
                if (!this.fearSafe && Math.random() < 0.04) {
                    this._spawnShadowWave();
                }

                if (this.fearGate && Math.abs(this.fearGate.x - this.hero.x) < 40) {
                    this._completeChapter();
                }
                if (!this.completed) this._emitFearProgress();
            } else {
                // Trial not started yet
                vx = 0;
                vy = 0;
            }

            // Update shadow waves
            this.fearWaves.forEach((w) => {
                w.x += w.vx * dt;
                w.alpha = Math.max(0, w.alpha - 0.4 * dt);
            });
            this.fearWaves = this.fearWaves.filter((w) => {
                if (w.alpha <= 0 || w.x < -60 || w.x > W + 60) {
                    w.destroy();
                    return false;
                }
                return true;
            });
        }

        // Chapter 6: collect vows, then cross the second gate
        if (this.chapterId === 6 && canMove) {
            if (this.thresholdGateOpen) {
                if (
                    this.secondGate &&
                    Math.abs(this.secondGate.x - this.hero.x) < 42
                ) {
                    this._completeChapter();
                }
            } else if (
                this.secondGate &&
                Math.abs(this.secondGate.x - this.hero.x) < 90
            ) {
                vx -= Math.max(0, vx) * 0.8;
                if (!this.thresholdGateHintShown) {
                    this.thresholdGateHintShown = true;
                    gameEvents.emit(
                        "hud:hint",
                        "The gate waits for three vows before it opens."
                    );
                }
            } else {
                this.thresholdGateHintShown = false;
            }
            if (!this.completed) this._emitChapter6Progress();
        }

        // Chapter 8: answer fires, then step into the central flame
        if (this.chapterId === 8 && canMove) {
            if (
                this.centralFlameOpen &&
                this.centralFlame &&
                Math.abs(this.centralFlame.x - this.hero.x) < 44
            ) {
                this._completeChapter();
            }
            if (!this.completed) this._emitChapter8Progress();
        }

        // Chapter 9: breathe, listen, then reach the far shore
        if (this.chapterId === 9 && canMove) {
            if (
                this.shoreOpen &&
                this.farShore &&
                Math.abs(this.farShore.x - this.hero.x) < 44
            ) {
                this._startSeaClosing();
            }
            if (!this.completed) this._emitChapter9Progress();
        }

        // Chapter 10: meet helpers, then cross the bridge
        if (this.chapterId === 10 && canMove) {
            if (
                this.bridgeOpen &&
                this.riverBridge &&
                Math.abs(this.riverBridge.x - this.hero.x) < 46
            ) {
                this._startRiverClosing();
            }
            if (!this.completed) this._emitChapter10Progress();
        }

        // Chapter 11: name stones, then speak into the well
        if (this.chapterId === 11 && canMove) {
            if (
                this.voiceWellOpen &&
                this.voiceWell &&
                Math.abs(this.voiceWell.x - this.hero.x) < 48
            ) {
                this._startInitiationClosing();
            }
            if (!this.completed) this._emitChapter11Progress();
        }

        // Chapter 12: push through the inward mist and pause at three markers
        if (this.chapterId === 12 && canMove) {
            const progress = Phaser.Math.Clamp(
                (this.hero.x - W * 0.18) / (W * 0.72),
                0,
                1
            );
            this.inwardMistStrength = Phaser.Math.Clamp(1.05 - progress * 0.72, 0.28, 1.05);
            vx -= 0.34 * this.inwardMistStrength * speed * dt;
            vx *= 0.62;

            for (const marker of this.inwardMarkers || []) {
                if (!marker.reached && this.hero.x >= marker.x - 18) {
                    marker.reached = true;
                    if (marker.glow) marker.glow.setFillStyle(0xfadb5f, 0.48);
                    gameEvents.emit("lantern:adjust", 0.015);
                    gameEvents.emit("dialogue:open", {
                        speaker: null,
                        kind: "narration",
                        text: marker.markerText,
                    });
                    this._emitChapter12Progress();
                    break;
                }
            }

            if (
                this.inwardGate &&
                !this.inwardArrivalStarted &&
                Math.abs(this.inwardGate.x - this.hero.x) < 42
            ) {
                this.inwardArrivalStarted = true;
                this._afterDialogue = () => this._completeChapter();
                gameEvents.emit("script:start", { name: "inward-threshold-arrival" });
            }
            if (!this.completed) this._emitChapter12Progress();
        }

        // Clamp hero position
        this.hero.x = Phaser.Math.Clamp(this.hero.x + vx, 30, W - 30);
        this.hero.y = Phaser.Math.Clamp(
            this.hero.y + vy,
            H - 180,
            H - 70
        );

        // Hero facing
        if (vx > 0.05) this.hero.heading = "right";
        else if (vx < -0.05) this.hero.heading = "left";

        // Fog ribbons
        this._drawFog(dt);
        this._updateInteractPrompt();

        // Kavi follow
        if (this.kavi) {
            this.kaviPhase = (this.kaviPhase || 0) + dt * 2.4;
            const targetX = this.hero.x + 28;
            const targetY = this.hero.y - 36 + Math.sin(this.kaviPhase) * 4;
            this.kavi.x += (targetX - this.kavi.x) * 0.08;
            this.kavi.y += (targetY - this.kavi.y) * 0.08;
        }
    }

    _drawFog(dt) {
        this._fogOffset += dt * 12;
        const fog = this.fog;
        fog.clear();
        let bands = 6;
        let intensity = 0.06;
        if (this.chapterId === 1) intensity = 0.08;
        if (this.chapterId === 2) intensity = 0.05 * (1 - (this._colorBloom || 0));
        if (this.chapterId === 4) intensity = 0.1 * this.fogStrength;
        if (this.chapterId === 5) intensity = 0.07;
        if (this.chapterId === 6) intensity = 0.04;
        if (this.chapterId === 7) intensity = 0.035;
        if (this.chapterId === 8) intensity = 0.045;
        if (this.chapterId === 9) intensity = 0.055;
        if (this.chapterId === 10) intensity = 0.025;
        if (this.chapterId === 11) intensity = 0.035;
        if (this.chapterId === 12) intensity = 0.085 * (this.inwardMistStrength || 1);
        if (this.chapterId === 13) intensity = 0.018;
        if (this.chapterId === 3) intensity = 0.03;
        for (let i = 0; i < bands; i++) {
            const y = 80 + i * 65 + Math.sin((this._fogOffset + i * 20) * 0.05) * 6;
            fog.fillStyle(0xcccccc, intensity * (1 - i / bands));
            fog.fillRect(0, y, W, 36);
        }

        // Color bloom in chapter 2
        if (this.chapterId === 2 && this._colorBloom > 0) {
            fog.fillStyle(0xfadb5f, 0.05 * this._colorBloom);
            fog.fillRect(0, 0, W, H);
        }
    }

    _spawnShadowWave() {
        const yBand = H - 110 + (Math.random() - 0.5) * 60;
        const fromLeft = Math.random() < 0.5;
        const g = this.add.graphics();
        g.fillStyle(0x4b4f7a, 0.5);
        g.fillEllipse(0, 0, 70, 14);
        g.x = fromLeft ? -40 : W + 40;
        g.y = yBand;
        g.vx = fromLeft ? 280 : -280;
        g.alpha = 0.7;
        g.setBlendMode(Phaser.BlendModes.ADD);
        this.fxLayer.add(g);
        this.fearWaves.push(g);
    }

    // External: dialogue is opened by React; lock movement
    setDialogueOpen(open) {
        this.dialogueOpen = open;
    }
}
