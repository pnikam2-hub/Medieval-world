import Phaser from "phaser";
import { gameEvents } from "./events";

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

        // Cleanup
        this.events.once("shutdown", () => {
            gameEvents.off("mirror:toggle", this._onMirror);
            gameEvents.off("input:mobile", this._onMobile);
            gameEvents.off("dialogue:done", this._onDialogueDone);
            gameEvents.off("scene:dialogue-lock", this._onLock);
            gameEvents.off("fear:trial-start", this._onFearTrial);
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

        if ([4].includes(this.chapterId)) {
            // Open road out of city, soft hills
            const hills = this.add.graphics();
            hills.fillStyle(0x121212, 1);
            hills.fillEllipse(W * 0.2, H - 30, 600, 220);
            hills.fillEllipse(W * 0.7, H - 20, 720, 260);
            this.bgLayer.add(hills);
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
            this.tara,
            this.mural,
            this.shadowTwin,
            this.secondGate,
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
            !(this.chapterId === 3); // Ch3 is dialogue only

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
