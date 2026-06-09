// 23-stage hero journey definitions. First 5 are playable in MVP.
export const CHAPTERS = [
    {
        id: 1,
        title: "Wasteland",
        subtitle: "The City of Dust",
        unlocked: true,
        kind: "explore",
        narration:
            "In the City of Dust, no one was sad, no one was joyful, and no one asked why the sky had forgotten blue.",
        endText:
            "Your chest-lantern flickers — for the first time, you remember it is there.",
        journalQuestion:
            "Where in your life do you feel something important has gone quiet?",
        helperLine: null,
    },
    {
        id: 2,
        title: "The Call",
        subtitle: "A heartbeat beneath the stone",
        unlocked: true,
        kind: "trail",
        narration:
            "Beneath the city, an ancient mural hums. A door. A memory. A question.",
        endText: "The Cave of Echoes opens before you, breathing soft gold.",
        journalQuestion: "What call have you been hearing but avoiding?",
        helperLine: null,
    },
    {
        id: 3,
        title: "Reluctant Hero",
        subtitle: "Tara in the Cave of Echoes",
        unlocked: true,
        kind: "dialogue",
        narration:
            "An elder waits in the cave, lit by a hundred small lanterns of memory.",
        endText:
            "An honest step is still a step. The road begins where you stop pretending.",
        journalQuestion:
            "What fear becomes softer when you admit it honestly?",
        helperLine: "Honest ones are useful. — Tara",
    },
    {
        id: 4,
        title: "Separation",
        subtitle: "Leaving the dust behind",
        unlocked: true,
        kind: "traverse",
        narration:
            "A small golden firefly slips from your chest-lantern. It looks at you as if it has known you forever.",
        endText: "Kavi joins you. You are smaller together, and somehow vast.",
        journalQuestion:
            "What familiar place, habit, or identity are you ready to step beyond?",
        helperLine: "I am tiny, yes. But darkness has terrible aim. — Kavi",
    },
    {
        id: 5,
        title: "Fear",
        subtitle: "The Shadow Twin at the threshold",
        unlocked: true,
        kind: "fear",
        narration:
            "At the first dark threshold, something that wears your face is waiting.",
        endText:
            "The first victory is not fear disappearing. It is you no longer disappearing inside fear.",
        journalQuestion: "What is one small step you can take even while afraid?",
        helperLine: "Or a way through. — You",
    },
    // Locked / coming-soon stages
    { id: 6, title: "Threshold Crossing", subtitle: "First gate, second world", unlocked: false, kind: "locked" },
    { id: 7, title: "Magical Helper", subtitle: "The Mirror Lens is given", unlocked: false, kind: "locked" },
    { id: 8, title: "Road of Trials", subtitle: "Small fires, larger truths", unlocked: false, kind: "locked" },
    { id: 9, title: "Night Sea Journey", subtitle: "Rhythmic grief", unlocked: false, kind: "locked" },
    { id: 10, title: "Adventure", subtitle: "Helpers along the river", unlocked: false, kind: "locked" },
    { id: 11, title: "Initiation", subtitle: "Naming the unspoken", unlocked: false, kind: "locked" },
    { id: 12, title: "Threshold Crossing", subtitle: "The inward turn", unlocked: false, kind: "locked" },
    { id: 13, title: "Apotheosis", subtitle: "Brief moment of vastness", unlocked: false, kind: "locked" },
    { id: 14, title: "Enter the Cave", subtitle: "Belly of the long dark", unlocked: false, kind: "locked" },
    { id: 15, title: "Courage", subtitle: "Veer, Guardian of Courage", unlocked: false, kind: "locked" },
    { id: 16, title: "Helpers", subtitle: "Asha, Nadi, Soma, Rhea", unlocked: false, kind: "locked" },
    { id: 17, title: "Belly of the Whale", subtitle: "Listening beneath the surface", unlocked: false, kind: "locked" },
    { id: 18, title: "Rescue", subtitle: "What the heart remembers", unlocked: false, kind: "locked" },
    { id: 19, title: "Tests", subtitle: "Shame, anger, power", unlocked: false, kind: "locked" },
    { id: 20, title: "Magical Flight", subtitle: "Rising on the breath of helpers", unlocked: false, kind: "locked" },
    { id: 21, title: "Dragon Battle", subtitle: "The Dragon of Forgetting", unlocked: false, kind: "locked" },
    { id: 22, title: "Return", subtitle: "Carrying light back to dust", unlocked: false, kind: "locked" },
    { id: 23, title: "Treasure", subtitle: "The awakened heart", unlocked: false, kind: "locked" },
];

// Citizen NPC dialogue for Chapter 1. Mirror Lens reveals hidden truth.
export const CITIZENS = [
    {
        id: "citizen-a",
        label: "Citizen",
        surfaceLabel: "I am fine",
        hiddenLabel: "Exhaustion",
        surface: "I am fine. Everyone is fine.",
        hidden: "Tired. Tired for a very long time.",
        x: 0.22,
        response:
            "Then why does the whole city sound like it is holding its breath?",
    },
    {
        id: "citizen-b",
        label: "Citizen",
        surfaceLabel: "Nothing changes",
        hiddenLabel: "Loneliness",
        surface: "Nothing has changed. Nothing changes here.",
        hidden: "I cannot remember when I last laughed.",
        x: 0.5,
        response: "Some quiet things are louder than they look.",
    },
    {
        id: "citizen-c",
        label: "Citizen",
        surfaceLabel: "Keep walking",
        hiddenLabel: "Unspoken grief",
        surface: "Why are you stopping? Keep walking. Everyone keeps walking.",
        hidden: "If I stop, I will feel it all at once.",
        x: 0.78,
        response: "Maybe stopping is the first honest thing.",
    },
];

// Chapter 3 dialogue script (Tara, Cave of Echoes) — multi-choice.
export const TARA_DIALOGUE = [
    { speaker: "Tara", text: "Sit. The cave is older than your doubt." },
    { speaker: "You", text: "I am not chosen. I am barely managing." },
    {
        speaker: "Tara",
        text: "Good. Chosen ones are often insufferable. Honest ones are useful.",
    },
    { speaker: "You", text: "What if I fail?" },
    {
        speaker: "Tara",
        text: "Then you will have found the first honest step.",
        choice: {
            prompt: "Answer Tara — speak from where you actually stand.",
            options: [
                {
                    id: "deny",
                    tag: "Avoidance",
                    text: "I am only here by accident. Wrong cave.",
                    outcome:
                        "Tara smiles. 'The cave does not believe in accidents. Try again.'",
                    lantern: -0.05,
                    advance: false,
                },
                {
                    id: "joke",
                    tag: "Control",
                    text: "Sure. Hero stuff. Where do I sign?",
                    outcome:
                        "Tara waits. 'Jokes are armor. Useful, but heavy. Try again.'",
                    lantern: 0,
                    advance: false,
                },
                {
                    id: "bargain",
                    tag: "Control",
                    text: "I'll go, but only halfway. Just a look.",
                    outcome:
                        "Tara nods kindly. 'A door does not open by halves. Try again.'",
                    lantern: 0,
                    advance: false,
                },
                {
                    id: "honest",
                    tag: "Honesty",
                    text: "I am afraid. I want to go anyway. That is the truth.",
                    outcome:
                        "Tara lifts a small lens from her belt. 'Then we begin. This — the Mirror Lens — will be yours soon.'",
                    lantern: 0.25,
                    advance: true,
                },
            ],
        },
    },
];

// Chapter 5 shadow twin script (pre-trial)
export const SHADOW_DIALOGUE = [
    { speaker: "Shadow Twin", text: "Turn back. You are too small for this." },
    { speaker: "You", text: "Maybe. But I can take one step." },
    {
        speaker: "Shadow Twin",
        text: "One step becomes a road. A road becomes a wound.",
    },
    { speaker: "You", text: "Or a way through." },
];

// Chapter 2 mural script
export const MURAL_DIALOGUE = [
    {
        speaker: "Mural Voice",
        text: "You who still feel the missing thing, come closer.",
    },
    { speaker: "You", text: "Who are you?" },
    { speaker: "Mural Voice", text: "A door. A memory. A question." },
];

// Chapter 4 Kavi greeting
export const KAVI_DIALOGUE = [
    { speaker: "Kavi", text: "Are we lost?" },
    { speaker: "You", text: "Not yet." },
    { speaker: "Kavi", text: "That sounded suspiciously like yes." },
];
