// 23-stage hero journey definitions. Early stages are playable in the MVP.
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
    {
        id: 6,
        title: "Threshold Crossing",
        subtitle: "First gate, second world",
        unlocked: true,
        kind: "threshold",
        narration:
            "Beyond the first gate, the world is not brighter. It is simply more honest.",
        endText:
            "You cross because the old world can no longer hold the whole truth of you.",
        journalQuestion:
            "What promise will help you keep walking when the path no longer feels familiar?",
        helperLine: "A threshold is a question you answer with your feet. - Kavi",
    },
    {
        id: 7,
        title: "Magical Helper",
        subtitle: "The Mirror Lens is given",
        unlocked: true,
        kind: "helper",
        narration:
            "Tara stands at the edge of the second world, holding something small enough to fit in a palm and large enough to undo every lie you have ever told yourself.",
        endText:
            "The truth does not wound. The wound was already there. Truth only gives it air to heal.",
        journalQuestion:
            "What truth have you been holding the lens away from, and what might soften if you held it steady?",
        helperLine: "Hold the Mirror steady. Do not glance. See. - Tara",
    },
    {
        id: 8,
        title: "Road of Trials",
        subtitle: "Small fires, larger truths",
        unlocked: true,
        kind: "trials",
        narration:
            "The road between worlds is lit by small fires. Each one asks a question. Each question is a door.",
        endText:
            "You are not tested by what you can do. You are revealed by what you choose to notice.",
        journalQuestion:
            "What small fire have you been walking past, and what would happen if you stopped and sat beside it?",
        helperLine: "You sat down. Just... sat. That was brave. - Kavi",
    },
    {
        id: 9,
        title: "Night Sea Journey",
        subtitle: "Rhythmic grief",
        unlocked: true,
        kind: "night-sea",
        narration:
            "There is a sea that does not drown. It carries every tear ever shed, every goodbye never spoken, every silence that followed loss.",
        endText:
            "Grief is not a sea you cross once. It is a tide you learn to breathe with.",
        journalQuestion:
            "What grief, yours or someone else's, have you been holding your breath against?",
        helperLine: "It changes shape. That is not the same as leaving. But it becomes breathable. - Kavi",
    },
    {
        id: 10,
        title: "Adventure",
        subtitle: "Helpers along the river",
        unlocked: true,
        kind: "helpers",
        narration:
            "Beyond the sea, a river runs. Along its banks, four figures sit as if they have been waiting for someone.",
        endText:
            "You were never meant to walk alone. The helpers were always there; you just had to arrive at the river where they were waiting.",
        journalQuestion:
            "Who has been a helper on your journey, and have you let them know what their presence meant?",
        helperLine: "The journey was always meant to be shared. - Kavi",
    },
    {
        id: 11,
        title: "Initiation",
        subtitle: "Naming the unspoken",
        unlocked: true,
        kind: "initiation",
        narration:
            "Past the bridge waits a chamber with no doors, only names that were never spoken aloud.",
        endText:
            "What is named is no longer alone in the dark. A true name becomes a handhold.",
        journalQuestion:
            "What have you avoided naming, and what might change if you spoke it gently?",
        helperLine: "A true name is not a chain. It is a doorway. - Asha",
    },
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

// Chapter 7: Tara teaches the deeper use of the Mirror Lens.
export const TARA_LENS_DIALOGUE = [
    { speaker: "Tara", text: "You crossed. Good. Now the real seeing begins." },
    { speaker: "You", text: "The Mirror felt different at the gate." },
    {
        speaker: "Tara",
        text: "It was only half-awake before. Hold it steady. Do not glance. See.",
    },
    { speaker: "You", text: "What will I see?" },
    {
        speaker: "Tara",
        text: "First what hides. Then what hid the hiding. Then the wound that started it all.",
    },
    {
        speaker: "Tara",
        text: "Kavi carries something unsaid. Look at him with patience.",
    },
];

export const TARA_LENS_CLOSING = [
    {
        speaker: "Tara",
        text: "The lens is yours. Use it not to judge, but to understand what someone is protecting.",
    },
    { speaker: "Kavi", text: "Thank you. For not looking away." },
    { speaker: "You", text: "I could not. Not anymore." },
];

export const TRIAL_FIRES = [
    {
        id: "stranger",
        surfaceLabel: "Just resting",
        hiddenLabel: "Carrying something too heavy to name",
        x: 0.28,
        prompt: "The first fire asks what you do when someone suffers quietly.",
        choices: [
            {
                id: "walk-on",
                tag: "Avoidance",
                text: "Keep walking. Everyone carries something.",
                outcome:
                    "The fire gutters low. Kavi dims. The stranger does not accuse you; the road simply waits.",
                outcomeSpeaker: null,
                kind: "narration",
                lantern: -0.02,
                advance: false,
                retryText: "The fire waits. Choose again from the tender place.",
                event: {
                    name: "trial-fire:choice",
                    payload: { fireId: "stranger", accepted: false },
                },
            },
            {
                id: "sit-beside",
                tag: "Compassion",
                text: "Sit beside them. Not to fix - just to be there.",
                outcome:
                    "The stranger softens. A quiet voice says, 'No one has done that before.'",
                outcomeSpeaker: null,
                kind: "narration",
                lantern: 0.08,
                advance: true,
                event: {
                    name: "trial-fire:choice",
                    payload: { fireId: "stranger", accepted: true },
                },
            },
        ],
        afterLine: "You sat down. Just... sat. That was brave.",
    },
    {
        id: "promise",
        surfaceLabel: "Just an old campfire",
        hiddenLabel: "A promise someone made and forgot",
        x: 0.52,
        prompt: "The second fire asks what forgotten promises deserve.",
        choices: [
            {
                id: "not-mine",
                tag: "Avoidance",
                text: "Not my fire. Not my problem.",
                outcome:
                    "A cold wind crosses the road. The embers fold in on themselves, waiting.",
                outcomeSpeaker: null,
                kind: "narration",
                lantern: -0.02,
                advance: false,
                retryText: "The abandoned flame waits for a kinder answer.",
                event: {
                    name: "trial-fire:choice",
                    payload: { fireId: "promise", accepted: false },
                },
            },
            {
                id: "add-branch",
                tag: "Compassion",
                text: "Add a small branch. Even forgotten promises deserve warmth.",
                outcome:
                    "The flame revives. A whisper rises with the sparks: 'Remembered.'",
                outcomeSpeaker: null,
                kind: "narration",
                lantern: 0.06,
                advance: true,
                event: {
                    name: "trial-fire:choice",
                    payload: { fireId: "promise", accepted: true },
                },
            },
        ],
        afterLine:
            "A forgotten promise. And you remembered it. I am... a little brighter, I think.",
    },
    {
        id: "self",
        surfaceLabel: "Just my reflection",
        hiddenLabel: "Someone who is still learning to stay",
        x: 0.76,
        prompt: "The third fire asks how you speak to yourself.",
        choices: [
            {
                id: "not-enough",
                tag: "Control",
                text: "Not enough. Still not enough.",
                outcome:
                    "The pool ripples hard. Your reflection blurs, not gone, but difficult to hold.",
                outcomeSpeaker: null,
                kind: "narration",
                lantern: -0.03,
                advance: false,
                retryText: "The reflection steadies and asks for a gentler truth.",
                event: {
                    name: "trial-fire:choice",
                    payload: { fireId: "self", accepted: false },
                },
            },
            {
                id: "you-are-trying",
                tag: "Compassion",
                text: "You are trying. That is already more than before.",
                outcome:
                    "The pool stills. A faint golden light rises from beneath the reflection.",
                outcomeSpeaker: null,
                kind: "narration",
                lantern: 0.1,
                advance: true,
                event: {
                    name: "trial-fire:choice",
                    payload: { fireId: "self", accepted: true },
                },
            },
        ],
        afterLine:
            "You said 'you are trying' to yourself. I am going to borrow it.",
    },
];

export const TRIAL_OPENING_DIALOGUE = [
    { speaker: "Kavi", text: "Three fires. That seems... manageable?" },
    { speaker: "You", text: "Somehow I doubt 'manageable' is the point." },
    {
        speaker: "Kavi",
        text: "No. The point is probably something annoyingly deep.",
    },
];

export const MEMORY_BUOYS = [
    {
        id: "toy",
        color: 0xffb3c6,
        x: 0.2,
        surfaceLabel: "A child's lost toy",
        hiddenLabel: "Left behind when we fled. Still dreamed.",
        memory:
            "I left it behind when we fled. I still look for it in dreams.",
    },
    {
        id: "letter",
        color: 0x7fd9c4,
        x: 0.36,
        surfaceLabel: "A letter never sent",
        hiddenLabel: "Seven drafts. All true. None brave enough.",
        memory:
            "I wrote it seven times. Each version was true. None was sent.",
    },
    {
        id: "name",
        color: 0xb9a7ff,
        x: 0.52,
        surfaceLabel: "A name no one says",
        hiddenLabel: "Silence grew larger than love.",
        memory:
            "We stopped speaking her name. The silence grew larger than the love.",
    },
    {
        id: "door",
        color: 0xc7beb4,
        x: 0.68,
        surfaceLabel: "A door that stayed closed",
        hiddenLabel: "Knocked once. Never again.",
        memory:
            "I knocked once. Then I told myself they did not hear. I never knocked again.",
    },
    {
        id: "song",
        color: 0xfadb5f,
        x: 0.84,
        surfaceLabel: "A song half-remembered",
        hiddenLabel: "Mother's lullaby. Last verse lost.",
        memory:
            "My mother sang it. I cannot find the last verse. I have been searching for years.",
    },
];

export const SEA_OPENING_LINES = [
    { speaker: null, kind: "narration", text: "Breathe." },
    { speaker: null, kind: "narration", text: "Slower." },
    {
        speaker: null,
        kind: "narration",
        text: "The grief here is not yours. But it knows you.",
    },
    {
        speaker: null,
        kind: "narration",
        text: "Listen. Do not fix. Just listen.",
    },
];

export const SEA_CLOSING_DIALOGUE = [
    { speaker: "Kavi", text: "I was listening too. Every single one." },
    { speaker: "You", text: "They were not mine. But they felt like mine." },
    {
        speaker: "Kavi",
        text: "That is what grief does. It does not ask whose it is. It just arrives.",
    },
    { speaker: "You", text: "And it leaves?" },
    {
        speaker: "Kavi",
        text: "It changes shape. That is not the same as leaving. But it becomes breathable.",
    },
];

export const RIVER_HELPERS = [
    {
        id: "asha",
        name: "Asha",
        title: "The Rememberer",
        hiddenLabel:
            "Afraid that if I stop remembering, everything I love disappears",
        x: 0.18,
        color: 0xd7c0a1,
        gift: "remembering",
        lines: [
            "Drink. It is just water. It is also every river you have ever crossed.",
            "That is memory. It does not live only in the head. It lives in the body.",
            "If you forget, someone else will remember for you. That is why we travel together.",
        ],
    },
    {
        id: "nadi",
        name: "Nadi",
        title: "The River-Listener",
        hiddenLabel: "Afraid of my own silence",
        x: 0.38,
        color: 0x93c5fd,
        gift: "listening",
        lines: [
            "Step into the water. Not to cross. Just to feel.",
            "Rivers carry more than water. They carry every story spoken near their banks.",
            "The river is carrying yours now. It has been carrying yours for a very long time.",
        ],
    },
    {
        id: "soma",
        name: "Soma",
        title: "The Fire-Keeper",
        hiddenLabel: "Terrified of the dark inside myself",
        x: 0.6,
        color: 0xfb8500,
        gift: "fire",
        lines: [
            "Hold out your lantern. Just for a moment.",
            "You are just letting someone else's light touch yours.",
            "Fire does not divide. Fire multiplies. That is the first thing.",
        ],
    },
    {
        id: "rhea",
        name: "Rhea",
        title: "The Bridge-Builder",
        hiddenLabel: "I build bridges because I have burned too many",
        x: 0.8,
        color: 0xcbd5e1,
        gift: "bridge",
        lines: [
            "This bridge has been waiting for the last stone.",
            "The last stone is someone willing to cross it.",
            "Stone remembers touch. This bridge will remember you.",
        ],
    },
];

export const RIVER_OPENING_DIALOGUE = [
    { speaker: "Kavi", text: "There are people here. Actual people. This is the best chapter." },
    { speaker: "You", text: "They look like they have been waiting." },
    { speaker: "Kavi", text: "Maybe they have. Maybe the river told them." },
];

export const RIVER_CLOSING_DIALOGUE = [
    { speaker: "Asha", text: "You carry our remembering now." },
    { speaker: "Nadi", text: "You carry the river's listening." },
    { speaker: "Soma", text: "You carry my fire, and yours." },
    { speaker: "Rhea", text: "Cross. We will be here when you need us again." },
    { speaker: "Kavi", text: "Four helpers. Four gifts. You thought you were doing this alone." },
];

export const INITIATION_STONES = [
    {
        id: "grief",
        x: 0.24,
        surfaceLabel: "Old silence",
        hiddenLabel: "Grief asking to be named",
        line: "I am grief. I am not here to end the journey. I am here because love mattered.",
    },
    {
        id: "anger",
        x: 0.42,
        surfaceLabel: "Hot stone",
        hiddenLabel: "Anger guarding a boundary",
        line: "I am anger. I became loud when something precious was crossed.",
    },
    {
        id: "shame",
        x: 0.6,
        surfaceLabel: "Low shadow",
        hiddenLabel: "Shame hiding a wish to belong",
        line: "I am shame. I learned to shrink before anyone could send me away.",
    },
    {
        id: "longing",
        x: 0.78,
        surfaceLabel: "Faint song",
        hiddenLabel: "Longing remembering the way home",
        line: "I am longing. I point toward what the heart still knows is possible.",
    },
];

export const INITIATION_OPENING_DIALOGUE = [
    { speaker: "Asha", text: "This chamber does not ask you to conquer anything." },
    { speaker: "You", text: "Then what does it want?" },
    { speaker: "Asha", text: "Names. Speak what has been waiting without a name." },
];

export const INITIATION_CLOSING_DIALOGUE = [
    { speaker: "You", text: "Grief. Anger. Shame. Longing." },
    { speaker: "Asha", text: "Now they can answer when called, instead of ruling from the dark." },
    { speaker: "Kavi", text: "That felt frightening. Also... lighter." },
    { speaker: "You", text: "Maybe naming is how the light finds the room." },
];
