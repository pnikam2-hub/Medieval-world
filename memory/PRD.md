# Heartbound: The Hero Within — PRD

## Original Problem Statement
Build a browser-based animated narrative adventure game prototype called "Heartbound: The Hero Within": a mythic consciousness-elevation adventure inspired by Joseph Campbell's hero journey, mirror-neuron empathy, and heart intelligence (creative inspiration only — no medical/therapeutic claims). The player should feel transformation through story, choices, animation, puzzles, music, and symbolic gameplay rather than lectures.

Core message: "The treasure was never outside the hero. The treasure was the awakened heart, already present but forgotten."

## Architecture
- **Frontend stack**: React 19 + Phaser 3 (game canvas) + Tailwind CSS + Shadcn UI
- **Backend**: FastAPI (unchanged — single-player game, no auth)
- **Persistence**: `localStorage` under key `heartbound.save.v1`
- **Fonts**: Cormorant Garamond (mythic display) + Outfit (HUD)
- **Routing**: BrowserRouter with `/`, `/character`, `/map`, `/game/:chapterId`, `/journal/:chapterId`, `/threshold`
- **Phaser ↔ React bridge**: lightweight pub/sub event bus (`src/game/events.js`) for `dialogue:open`, `script:start`, `chapter:complete`, `hud:hint`, `lantern:adjust`, `mirror:toggle`, `scene:dialogue-lock`, `fear:trial-start`

## User Personas
- **The Seeker**: Plays for the mythic story and self-reflection.
- **The Player**: Plays for the game loop — movement, puzzles, choices.
- **The Returner**: Wants persistence — to come back and continue.

## Core Requirements (Static)
- Title screen with Start / Continue / Chapter Map
- Character selection (Arin / Mira / Custom) with name + lantern accent (Gold / Ember / Moonlight)
- Spiral chapter map of all 23 hero-journey stages — first 5 unlocked, 18 locked
- 5 fully playable chapters with unique gameplay per chapter
- Heart-Lantern meter (awareness, not health)
- Mirror Lens toggle (M) revealing hidden emotional truths
- Consciousness Journal (J) with optional local notes
- Kavi firefly companion (appears Chapter 4)
- Final "first threshold crossed" screen after Chapter 5
- Responsive (desktop + mobile touch controls)
- localStorage save/load

## Implemented (Feb 2026)
- ✅ Title screen with cinematic dark palette, mountain silhouette, breathing heart-lantern
- ✅ Character selection (3 presets, name input, 3 accents)
- ✅ Spiral chapter map (23 SVG nodes + 23 chapter cards, locked/unlocked states, current-chapter pulse)
- ✅ Chapter 1 (Wasteland): walk + interact with 3 citizens + collect 3 heartbeat pulses
- ✅ Chapter 2 (The Call): follow 3 sequential heartbeat pulses → mural → cave (color bloom on progress)
- ✅ Chapter 3 (Reluctant Hero): Tara dialogue with 4 emotional choices (Avoidance/Control/Honesty) — only "honest" advances and unlocks `truthful-response` quality
- ✅ Chapter 4 (Separation): traversal vs fog pulling backward, Kavi firefly companion spawns
- ✅ Chapter 5 (Fear): Shadow Twin dialogue + fear-pulse trial (move only when steady, shadow waves push back during danger phase)
- ✅ Heart-Lantern HUD (animated breathing glow, percentage), Mirror Lens HUD button, Journal HUD button, back-to-map button
- ✅ Dialogue box overlay (speaker label, narration variant, click/space to advance, choice cards with tags)
- ✅ Journal screen with prompt + textarea + save/skip
- ✅ Threshold screen with quote
- ✅ Keyboard controls (Arrows/WASD, Space/Enter, M, J)
- ✅ Mobile on-screen controls (D-pad, interact, mirror, journal)
- ✅ localStorage persistence (hero, lantern, completedChapters, journal, unlockedQualities)
- ✅ Continue button shows correct chapter, enabled only after first completion
- ✅ Verified by automated frontend testing — 100% pass rate

## P0 Backlog (Next)
- Chapter 1 pulses spawn only after speaking with all citizens (currently independent)
- Subtle ambient audio (Web Audio procedural drone + heartbeat) — currently silent
- Animate hero idle/walk (currently a static silhouette in Phaser)
- Mirror Lens visual filter on Phaser canvas (currently only React filter on canvas host)

## P1 Backlog
- Chapter 6+ implementation (Threshold Crossing → Treasure)
- Asha / Veer / Nadi / Soma / Rhea helper NPCs
- Dragon of Forgetting final encounter
- Settings (text speed, audio toggle, accessibility)
- Sharable Threshold cards (PNG export of completed journey state) — promoting word-of-mouth

## P2 Backlog
- Cloud sync of journal notes (FastAPI + MongoDB) for cross-device continuity
- Localization (FR / ES / DE / JA)
- Speed-run / accessibility presets
- Procedural soundscape per chapter

## Known Limitations
- Audio not yet implemented
- Hero sprite is a stylized silhouette (no walk-cycle yet)
- No tutorial overlay — the first narration is the only instruction (intentional, but adds onboarding risk)
