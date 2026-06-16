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
        title: "The Chamber of Stones",
        subtitle: "What the light has been keeping",
        unlocked: true,
        kind: "initiation",
        narration:
            "The lantern is full now. It does not need more light. It has become a room for what waited without a name.",
        endText:
            "What is named is no longer alone in the dark. A true name is not a verdict. It is a handhold.",
        journalQuestion:
            "What have you been keeping company with in silence, and what might shift if you spoke its name gently, just once?",
        helperLine: "A true name is not a chain. It is a doorway. - Kavi",
    },
    {
        id: 12,
        title: "The Inward Threshold",
        subtitle: "No one else can verify this crossing",
        unlocked: true,
        kind: "traverse",
        narration:
            "The outer journey is done. But there is one threshold no one else can see.",
        endText:
            "Some thresholds are crossed alone. Not because no one would come, but because only you can carry the lantern inward.",
        journalQuestion:
            "What threshold have you been standing at, and what would it take to let yourself cross it because you mean it?",
        helperLine: "I am still here. Counting your steps. - Kavi",
    },
    {
        id: 13,
        title: "Apotheosis",
        subtitle: "A brief moment of vastness",
        unlocked: true,
        kind: "dialogue",
        narration:
            "The inward passage opens into something without walls, where every distant light is another lantern.",
        endText:
            "You are small in the way a lantern is small: not insufficient, but precisely enough to see by.",
        journalQuestion:
            "When have you touched something vast, and what did it tell you about the size of your own life?",
        helperLine: "Small but not alone. That is exactly the thing. - Kavi",
    },
    {
        id: 14,
        title: "The Long Dark",
        subtitle: "Where even names echo",
        unlocked: true,
        kind: "explore",
        narration:
            "The vastness closes gently. What opens now is narrow, dark, and old.",
        endText:
            "The long dark is not empty. It is full of things that waited for light, and light, even small light, is enough to find them.",
        journalQuestion:
            "What part of yourself have you left in the dark, and what would it mean to turn the lantern toward it just to let it know you came back?",
        helperLine: "Still here. Take your time. - Kavi",
    },
    {
        id: 15,
        title: "Courage",
        subtitle: "Veer, Guardian of Courage",
        unlocked: true,
        kind: "helper",
        narration:
            "A stone chamber waits beyond the long dark, veined with amber light and guarded by someone who does not move.",
        endText:
            "Courage is not a roar. It is a quiet voice at the end of the day that says: I will try again tomorrow.",
        journalQuestion:
            "What fear have you been calling cowardice that is actually love: afraid of failing, afraid of harming, afraid of losing someone you have not yet found again?",
        helperLine: "The stillest things are often the strongest. - You",
    },
    {
        id: 16,
        title: "The Helpers Return",
        subtitle: "Asha, Nadi, Soma, Rhea",
        unlocked: true,
        kind: "explore",
        narration:
            "A warm chamber opens inside the dark. Four helpers wait where the road becomes too deep to walk alone.",
        endText:
            "You were never meant to carry this alone. The gifts of others are not debts; they are lanterns held out in the dark.",
        journalQuestion:
            "What gift has someone given you, not a thing but a way of being, that you carry without having fully thanked them?",
        helperLine: "Four gifts. Four helpers. I am being very brave about this. - Kavi",
    },
    {
        id: 17,
        title: "The Deep Listen",
        subtitle: "Beneath every name, a sound",
        unlocked: true,
        kind: "explore",
        narration:
            "Below the chamber and below the long dark, there is a listening that has been happening since before you were wounded.",
        endText:
            "There is a listening at the bottom of you that has never stopped. Being heard, truly heard, is sometimes enough to begin again.",
        journalQuestion:
            "When have you felt truly heard, not agreed with or fixed, just heard, and what did that hearing make possible?",
        helperLine: "It was hearing you the whole time. - Kavi",
    },
    {
        id: 18,
        title: "Rescue",
        subtitle: "What the heart remembers",
        unlocked: true,
        kind: "explore",
        narration:
            "At the far end of the deep, a small figure sits with their back turned, still waiting.",
        endText:
            "Rescue is not pulling someone from the dark. It is walking into the dark, sitting beside them, and saying: I remember now.",
        journalQuestion:
            "What younger part of yourself did you leave behind to become strong, and what would you say if you walked back now?",
        helperLine: "The lantern is warmer now. Not brighter. Warmer. - Kavi",
    },
    {
        id: 19,
        title: "Three Tests",
        subtitle: "Shame, anger, power",
        unlocked: true,
        kind: "threshold",
        narration:
            "Three arches wait, not to prove you are changed, but to ask whether you can live differently with what you have named.",
        endText:
            "You are not tested by what you can endure. You are revealed by how you hold what you already know.",
        journalQuestion:
            "What truth about yourself have you acknowledged but not yet lived differently, and what would one small change look like?",
        helperLine: "That is the whole journey. Staying differently. - Kavi",
    },
    {
        id: 20,
        title: "Magical Flight",
        subtitle: "Rising on the breath of helpers",
        unlocked: true,
        kind: "flight",
        narration:
            "The quiet center opens upward. The helpers' gifts become wind under the lantern.",
        endText:
            "Flight is not escape. It is what happens when what once weighed you down becomes wings.",
        journalQuestion:
            "What old weight in you is ready to become movement rather than burden?",
        helperLine: "We are flying. I am pretending this was always my plan. - Kavi",
    },
    {
        id: 21,
        title: "Dragon Battle",
        subtitle: "The Dragon of Forgetting",
        unlocked: true,
        kind: "dragon",
        narration:
            "At the highest dark, the Dragon of Forgetting waits with a mouth full of old names.",
        endText:
            "The dragon was never defeated by force. It loosened when you remembered what it could not erase.",
        journalQuestion:
            "What truth about yourself must you remember when fear tries to rename you?",
        helperLine: "It cannot eat what you keep remembering together. - Kavi",
    },
    {
        id: 22,
        title: "Return",
        subtitle: "Carrying light back to dust",
        unlocked: true,
        kind: "return",
        narration:
            "The road bends back to the City of Dust. Nothing has changed. Everything has changed.",
        endText:
            "Return is not going back as you were. It is carrying what you found into the place that forgot it.",
        journalQuestion:
            "Where in ordinary life are you being asked to return with more light than you had before?",
        helperLine: "The city looks the same. You do not. That matters. - Kavi",
    },
    {
        id: 23,
        title: "Treasure",
        subtitle: "The awakened heart",
        unlocked: true,
        kind: "finale",
        narration:
            "At the center of the city, the treasure waits where it has always been: inside the heart that learned to see.",
        endText:
            "The treasure was never outside the hero. The treasure was the awakened heart, already present but forgotten.",
        journalQuestion:
            "What treasure has this journey helped you remember was already alive in you?",
        helperLine: "I knew it. Mostly. With only a few doubts. - Kavi",
    },
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
        x: 0.2,
        color: 0x7f8ea3,
        width: 42,
        height: 34,
        surfaceLabel: "This is old. I am fine now.",
        hiddenLabel: "I still miss them. Every quiet morning.",
        deeperLabel: "Not missing less - missing differently.",
        line: "I am grief. I am not here to end the journey. I am here because love mattered.",
        kaviLine: "...Loss leaves a shape. That shape is still here.",
        offering: "Grief, I name you. You are not alone in the dark.",
    },
    {
        id: "anger",
        x: 0.4,
        color: 0x8a3f2b,
        width: 34,
        height: 48,
        surfaceLabel: "It does not bother me anymore.",
        hiddenLabel: "It still burns. I just stopped feeding it words.",
        deeperLabel: "The fire was trying to protect something.",
        line: "I am anger. I became loud when something precious was crossed.",
        kaviLine: "Anger that old... it has been guarding something. Maybe you.",
        offering: "Anger, I name you. I see what you were protecting.",
    },
    {
        id: "shame",
        x: 0.6,
        color: 0xc9c2b8,
        width: 30,
        height: 32,
        surfaceLabel: "That was a long time ago.",
        hiddenLabel: "I still flinch when I remember. I still hide it.",
        deeperLabel: "I was a person who did not know what I know now.",
        line: "I am shame. I learned to shrink before anyone could send me away.",
        kaviLine: "The flinch. I have seen it. I did not know it had a name.",
        offering: "Shame, I name you. You are what I survived, not what I am.",
    },
    {
        id: "longing",
        x: 0.8,
        color: 0xd59b45,
        width: 44,
        height: 44,
        surfaceLabel: "I have moved on.",
        hiddenLabel: "I still reach for it in sleep. I still turn my head.",
        deeperLabel: "What I long for is the self I was before I lost it.",
        line: "I am longing. I point toward what the heart still knows is possible.",
        kaviLine: "Longing is not broken wanting. It is remembering in the dark.",
        offering: "Longing, I name you. You are the shape of something that mattered.",
    },
];

export const INITIATION_OPENING_DIALOGUE = [
    {
        speaker: null,
        kind: "narration",
        text: "Four stones. Four names the dark was keeping for you. Not to judge. To sit beside.",
    },
    {
        speaker: "Kavi",
        text: "This place... it is not outside, is it? It was in the lantern the whole time.",
    },
    {
        speaker: "You",
        text: "I think the lantern was just keeping it safe until I was ready.",
    },
    { speaker: "Kavi", text: "Then I am glad I am here. Someone should be." },
];

export const INITIATION_WELL_DIALOGUE = [
    {
        speaker: "The Well",
        text: "Speak them. Not to me - to the ones who have been waiting.",
    },
    ...INITIATION_STONES.map((stone) => ({
        speaker: "You",
        text: "The name rises to your mouth.",
        choice: {
            prompt: "Speak into the well",
            options: [
                {
                    id: `offer-${stone.id}`,
                    tag: "Voice",
                    text: stone.offering,
                    outcome: `${stone.offering} The ${stone.id} stone answers with a quiet chime.`,
                    outcomeSpeaker: null,
                    kind: "narration",
                    lantern: 0.02,
                    advance: true,
                },
            ],
        },
    })),
];

export const INITIATION_CLOSING_DIALOGUE = [
    {
        speaker: "The Well",
        text: "...They have been waiting a long time. They did not know if you would come.",
    },
    { speaker: "You", text: "I did not know if I could." },
    { speaker: "The Well", text: "And yet." },
    { speaker: "Kavi", text: "...And yet." },
];

export const INWARD_THRESHOLD_MARKERS = [
    {
        id: "old-world",
        x: 0.35,
        text: "The old world is still behind you. It is not angry. It is just waiting to see if you mean it.",
    },
    {
        id: "turn-back",
        x: 0.55,
        text: "Something in you wants to turn back. That something is not weakness. It is care for who you were.",
    },
    {
        id: "honest-step",
        x: 0.75,
        text: "The next step is not about bravery. It is about honesty. You know the way now.",
    },
];

export const INWARD_THRESHOLD_OPENING = [
    {
        speaker: null,
        kind: "narration",
        text: "It turns inward. It has no guards. It has only the mist of everything you might still turn back for.",
    },
    {
        speaker: "Kavi",
        text: "This one... this one is different. The first gate was about leaving. This one is about arriving somewhere there are no maps.",
    },
    {
        speaker: "You",
        text: "I know. I can feel it. The lantern does not need more light. It needs me to follow it inward.",
    },
];

export const INWARD_THRESHOLD_ARRIVAL = [
    {
        speaker: "Kavi",
        text: "You crossed. You actually crossed. I thought you might stop at the third marker.",
    },
    {
        speaker: "You",
        text: "I almost did. But I remembered what Tara said about honest steps.",
    },
    {
        speaker: "Kavi",
        text: "Then we are really doing this. The inside of the inside.",
    },
];

export const APOTHEOSIS_DIALOGUE = [
    {
        speaker: null,
        kind: "narration",
        text: "The passage opens. Not into another chamber. Into something without walls.",
    },
    {
        speaker: null,
        kind: "narration",
        text: "Above you, lights: hundreds, thousands. Not stars. Lanterns. So distant they are barely warm. But they are there.",
    },
    { speaker: "You", text: "How many...?" },
    {
        speaker: "Kavi",
        text: "Everyone. Everyone who ever carried a lantern. Everyone who ever will.",
    },
    {
        speaker: "Kavi",
        text: "I thought I was small before. I did not understand what small meant.",
    },
    { speaker: "You", text: "Small but not alone." },
    {
        speaker: "Kavi",
        text: "...No. Not alone. That is the thing. That is exactly the thing.",
    },
    { speaker: "The Vastness", text: "You who have named four stones." },
    { speaker: "The Vastness", text: "Beneath the stones, this." },
    { speaker: "The Vastness", text: "Unnamed. Unwounded. Waiting." },
    { speaker: "You", text: "Was this always here?" },
    { speaker: "The Vastness", text: "Before the first stone. Before the first wound. Yes." },
    {
        speaker: "Kavi",
        text: "I can feel it. Under everything. It does not hurt.",
    },
    {
        speaker: null,
        kind: "narration",
        text: "The moment passes. Vastness cannot be held, only touched. But the memory of it settles into the lantern like a second flame.",
    },
    {
        speaker: "Kavi",
        text: "I will remember this. When it gets dark again. I will remember the lanterns.",
    },
];

export const LONG_DARK_OPENING = [
    {
        speaker: null,
        kind: "narration",
        text: "The vastness closes. Not harshly, but gently, like a door that knows you will return.",
    },
    {
        speaker: null,
        kind: "narration",
        text: "What opens now is narrow. Dark. Old. This is the place beneath the chamber, beneath the stones, beneath even the voice that named them.",
    },
    { speaker: "Kavi", text: "It is... very dark. Even for me. And I live in a lantern." },
    { speaker: "You", text: "The lantern is enough. It only has to show the next step." },
    { speaker: "Kavi", text: "Then I will watch the step with you." },
];

export const LONG_DARK_ECHOES = [
    {
        id: "hum",
        x: 0.2,
        shape: "child",
        surfaceLabel: "Just a shadow",
        hiddenLabel: "The self that still knew how to hum",
        deeperLabel: "You hummed through fear. You still can.",
        fragment: "Someone small is humming. The tune is familiar. You cannot place it.",
        kaviLine: "A hum. That means someone was here. Someone who could still make sound.",
    },
    {
        id: "door",
        x: 0.35,
        shape: "door",
        surfaceLabel: "A sealed room",
        hiddenLabel: "Where you put the memory you could not carry",
        deeperLabel: "The door was not locked. You just stopped trying the handle.",
        fragment: "A door. It has been closed so long the hinges have forgotten how to cry out.",
    },
    {
        id: "handprint",
        x: 0.5,
        shape: "handprint",
        surfaceLabel: "A mark on stone",
        hiddenLabel: "Proof that someone waited for you here",
        deeperLabel: "They waited. You came. That is the whole story.",
        fragment:
            "A handprint. Smaller than yours. Pressed into the stone as if to say: I was here. I was alone. I waited.",
        kaviLine: "The handprint. They waited. I wonder if anyone came.",
    },
    {
        id: "feather",
        x: 0.65,
        shape: "feather",
        surfaceLabel: "Bird debris",
        hiddenLabel: "Something that could fly passed through here",
        deeperLabel: "Even in the long dark, things with wings have been.",
        fragment: "A feather. Grey. Soft. Something flew through here once and left this behind.",
    },
    {
        id: "mirror",
        x: 0.82,
        shape: "mirror",
        surfaceLabel: "Broken glass",
        hiddenLabel: "A self you left behind, still waiting",
        deeperLabel: "They do not blame you. They have just been waiting to be seen.",
        fragment:
            "A mirror. Cracked but not shattered. In it, your own face, younger, looking back without recognition.",
        kaviLine: "Your own face. Younger. You came back for them. You actually came back.",
    },
];

export const LONG_DARK_EXIT_DIALOGUE = [
    { speaker: "Kavi", text: "There. Light. It is not the vastness. It is something smaller. Warmer." },
    { speaker: "You", text: "Enough to see by. Enough to keep walking." },
];

export const COURAGE_OPENING = [
    { speaker: "Veer", text: "You crossed the inward threshold. You touched the vastness. You walked the long dark." },
    { speaker: "Veer", text: "Now you stand before me. Do you know what I guard?" },
    { speaker: "You", text: "Courage." },
    {
        speaker: "Veer",
        text: "No. I guard the lie that courage means fearlessness. Courage is fear, held, named, and walked beside.",
    },
    {
        speaker: "Veer",
        text: "Three things in this room still frighten you. Look at them with the Mirror held steady.",
    },
    { speaker: "Kavi", text: "Held steady. We know how to do that. Tara taught us." },
];

export const COURAGE_FEAR_OBJECTS = [
    {
        id: "failure",
        x: 0.28,
        shape: "mirror",
        surfaceLabel: "Just my reflection",
        hiddenLabel: "I am afraid of failing everyone who believes in me",
        deeperLabel: "The fear of failing is proof that you care. Care is not weakness.",
        veerLine:
            "The fear of failing those who believe in you is not cowardice. That is love, afraid of its own insufficiency.",
    },
    {
        id: "anger",
        x: 0.52,
        shape: "fist",
        surfaceLabel: "Anger I thought I named",
        hiddenLabel: "I am afraid of what I might do if I let anger speak",
        deeperLabel: "Anger named is anger companioned. It will not consume you now.",
        veerLine:
            "The anger you named in the chamber still frightens you. Good. Named anger is still anger, but named anger does not own you.",
    },
    {
        id: "trust",
        x: 0.76,
        shape: "child",
        surfaceLabel: "Someone I left behind",
        hiddenLabel: "I am afraid I have lost the self who knew how to trust",
        deeperLabel: "They did not leave. They have been waiting. You are the one returning.",
        veerLine:
            "The child you think you lost is not gone. That child is the part of you that still knows how to wait without despair.",
    },
];

export const COURAGE_CLOSING = [
    {
        speaker: "Veer",
        text: "You have looked at three fears and you are still here. That is courage. Not the roar. The staying.",
    },
    {
        speaker: "Veer",
        text: "Go now. The deeper dark is ahead. But you will not enter it the same way you entered this room.",
    },
    { speaker: "Kavi", text: "He did not move. The whole time. He did not need to." },
    { speaker: "You", text: "The stillest things are often the strongest." },
];

export const HELPERS_RETURN_OPENING = [
    { speaker: "Kavi", text: "They are here. All four of them. How did they get here? This is the inside of the inside." },
    {
        speaker: "Asha",
        text: "The inside is where helpers have always been. You just had to arrive deep enough to see us.",
    },
    { speaker: "You", text: "At the river, you gave us gifts for the road." },
    {
        speaker: "Nadi",
        text: "The road is behind you. What comes next needs different gifts.",
    },
];

export const HELPER_RETURN_GIFTS = [
    {
        id: "asha",
        name: "Asha",
        x: 0.18,
        color: 0xfadb5f,
        gift: "Remembering",
        surfaceLabel: "The Rememberer",
        hiddenLabel: "Afraid that if I stop remembering, everything I love disappears",
        deeperLabel: "Memory is not a burden. It is a hand reaching across time.",
        lines: [
            "When you face the dragon, it will try to make you forget who you are.",
            "Hold this: one true memory. I have been keeping it for you since the river.",
            "The moment you decided to walk. Not the hero's walk. Just the first step. That was the truest thing.",
        ],
    },
    {
        id: "nadi",
        name: "Nadi",
        x: 0.38,
        color: 0x38bdf8,
        gift: "Listening",
        surfaceLabel: "The River-Listener",
        hiddenLabel: "Afraid of my own silence",
        deeperLabel: "Silence is not emptiness. It is the sound of everything waiting to be heard.",
        lines: [
            "There will be a silence so deep that even your voice will feel swallowed.",
            "When that happens, do not try to speak. Listen.",
            "I have put a listening in your lantern: water under stone.",
        ],
    },
    {
        id: "soma",
        name: "Soma",
        x: 0.62,
        color: 0xfb8500,
        gift: "Warmth",
        surfaceLabel: "The Fire-Keeper",
        hiddenLabel: "Terrified of the dark inside myself",
        deeperLabel: "The dark inside is not evil. It is the place where light begins.",
        lines: [
            "The long dark is cold. Not winter-cold. Forgetting-cold.",
            "Take this fire. It does not burn. It only warms. It will not go out.",
            "It is not about fuel. It is about what you are willing to hold.",
        ],
    },
    {
        id: "rhea",
        name: "Rhea",
        x: 0.82,
        color: 0xe2e8f0,
        gift: "Unseen Bridge",
        surfaceLabel: "The Bridge-Builder",
        hiddenLabel: "I build bridges because I have burned too many",
        deeperLabel: "Every bridge is an apology the world accepts without words.",
        lines: [
            "You will come to a place where there is no visible way forward.",
            "A bridge will appear because you became someone who can see it.",
            "If you cannot see it, walk anyway. Your feet will know before your eyes.",
        ],
    },
];

export const HELPERS_RETURN_CLOSING = [
    { speaker: "Asha", text: "Four gifts. Remembering. Listening. Warmth. The unseen bridge." },
    { speaker: "Nadi", text: "Carry them. They will not weigh you down." },
    { speaker: "Soma", text: "They will lift you. That is what gifts do, when they are given freely." },
    { speaker: "Rhea", text: "Go now. The deepest part is ahead. But you do not walk it alone." },
    { speaker: "Kavi", text: "Four gifts. Four helpers. I am going to be very brave about this and not cry." },
    { speaker: "You", text: "You can cry, Kavi." },
    { speaker: "Kavi", text: "...Maybe a little. Later. After the dragon." },
];

export const DEEP_LISTEN_OPENING = [
    {
        speaker: null,
        kind: "narration",
        text: "Below the chamber. Below the vastness. Below the long dark. Below even the place where helpers wait.",
    },
    {
        speaker: null,
        kind: "narration",
        text: "Here, there are no names. No stones. No words. Only a listening that has been happening since before you were wounded.",
    },
    { speaker: "Kavi", text: "I do not know what to say. There is nothing to say. But I can hear something." },
    { speaker: null, kind: "narration", text: "Wait. Do not fill the silence. Let it fill you." },
];

export const DEEP_LISTEN_FRAGMENTS = [
    "Before the first stone was placed, there was hum.",
    "Before the first wound, there was wholeness. It is still here. Under everything.",
    "You have been speaking. I have been hearing. All of it.",
    "I am not a voice. I am the space voices rise from.",
    "When you are ready, rise. I will still be here. I have always been here.",
];

export const DEEP_LISTEN_CLOSING = [
    {
        speaker: "Kavi",
        text: "It has been here. Under everything. Listening. Even when you could not hear it, it was hearing you.",
    },
    {
        speaker: "You",
        text: "All those years I thought I was alone in the silence. I was not. I just could not hear the listener.",
    },
    { speaker: "Kavi", text: "Now you can. That changes things. That changes everything." },
];

export const RESCUE_OPENING = [
    {
        speaker: null,
        kind: "narration",
        text: "The deep listening fades. But something remains: a thread, a warmth, a direction.",
    },
    { speaker: null, kind: "narration", text: "At the far end of the deep, a figure sits. Small. Still. Waiting." },
    { speaker: "Kavi", text: "Is that... is that you?" },
    { speaker: "You", text: "It is who I was. Before I learned to name the stones. Before the lantern was full." },
];

export const RESCUE_DIALOGUE = [
    { speaker: "Younger Self", text: "You came back. I did not think you would come back." },
    { speaker: "You", text: "I did not know you were here. I did not know you were waiting." },
    { speaker: "Younger Self", text: "Where else would I be? You left me here. When it was too much. When you had to be strong." },
    { speaker: "You", text: "I am sorry. I did not know that being strong meant leaving you behind." },
    { speaker: "Younger Self", text: "I kept humming. Did you hear me? Sometimes, in the quiet, I would hum the old song." },
    { speaker: "You", text: "The echo. In the long dark. That was you." },
    { speaker: "Younger Self", text: "I have been humming for a very long time." },
    { speaker: "You", text: "Will you walk with me now? Not ahead. Not behind. Beside." },
    { speaker: "Younger Self", text: "You will not leave again?" },
    { speaker: "You", text: "I know how to come back now. I know the way." },
    { speaker: "Younger Self", text: "Then I will walk. But slowly. I have not walked in a long time." },
];

export const RESCUE_CLOSING = [
    { speaker: "Kavi", text: "They are walking with us. Is this what rescue feels like?" },
    { speaker: "You", text: "It feels like remembering that they were never the part that needed to be left behind." },
    { speaker: "Kavi", text: "I think the lantern is warmer now. Not brighter. Warmer." },
];

export const THREE_TESTS_OPENING = [
    {
        speaker: null,
        kind: "narration",
        text: "Three arches. Three tests. Not to prove yourself, but to see if you can live differently with what you have named.",
    },
    { speaker: "Kavi", text: "Tests. I remember tests. The fires on the road. But these feel different. Closer." },
    { speaker: "You", text: "The fires tested what I would do for others. These test what I will do with myself." },
    { speaker: "Kavi", text: "Then I will stay close. Just so you know someone is watching who already believes in you." },
];

export const THREE_TEST_ARCHES = [
    {
        id: "shame",
        x: 0.22,
        title: "Shame",
        surfaceLabel: "First arch",
        hiddenLabel: "Where shame waits to see if you still believe it",
        deeperLabel: "Shame is the voice of someone who hurt you, internalized. You can give it back.",
        prompt: "The pale mirror says: If they knew, they would leave.",
        choices: [
            {
                id: "believe-shame",
                tag: "Old Voice",
                text: "Believe it.",
                outcome: "The arch chills. Kavi stays close, refusing to agree with the old voice.",
                outcomeSpeaker: null,
                kind: "narration",
                lantern: -0.02,
                advance: false,
                retryText: "The shame-voice repeats itself. Name what is speaking.",
            },
            {
                id: "name-shame",
                tag: "Voice",
                text: "Name it as shame speaking.",
                outcome: "The mirror softens. You know this voice now. It does not get to drive anymore.",
                outcomeSpeaker: null,
                kind: "narration",
                lantern: 0.04,
                advance: true,
                event: { name: "three-tests:choice", payload: { archId: "shame", accepted: true } },
            },
        ],
    },
    {
        id: "anger",
        x: 0.5,
        title: "Anger",
        surfaceLabel: "Second arch",
        hiddenLabel: "Where anger waits to be heard instead of silenced",
        deeperLabel: "Anger is not the enemy. Unheard anger is the enemy. Heard anger becomes clarity.",
        prompt: "The red arch asks whether anger can speak without being exiled.",
        choices: [
            {
                id: "quiet-anger",
                tag: "Control",
                text: "Shut it down. Anger is dangerous.",
                outcome: "The fire folds inward. Kavi whispers: You named it. Now listen.",
                outcomeSpeaker: null,
                kind: "narration",
                lantern: -0.02,
                advance: false,
                retryText: "The anger waits, still burning, still trying to protect something.",
            },
            {
                id: "hear-anger",
                tag: "Courage",
                text: "Let it speak. What do you need to say?",
                outcome: "Anger becomes boundary. It says no where you were once too small to say it.",
                outcomeSpeaker: null,
                kind: "narration",
                lantern: 0.04,
                advance: true,
                event: { name: "three-tests:choice", payload: { archId: "anger", accepted: true } },
            },
        ],
    },
    {
        id: "power",
        x: 0.78,
        title: "Power",
        surfaceLabel: "Third arch",
        hiddenLabel: "Where power asks what you will do with it",
        deeperLabel: "Power is not a weapon. It is a lantern. It can illuminate or it can blind.",
        prompt: "The bright arch asks what you will do with voice, courage, and clarity.",
        choices: [
            {
                id: "be-right",
                tag: "Fear",
                text: "Use them to be right.",
                outcome: "The image hardens. Kavi says: Power that needs to be right is fear wearing a crown.",
                outcomeSpeaker: null,
                kind: "narration",
                lantern: -0.03,
                advance: false,
                retryText: "The bright image waits for a gentler use of strength.",
            },
            {
                id: "stay-small",
                tag: "Safety",
                text: "Stay small. It is safer.",
                outcome: "The image shrinks. Kavi says: You did not come this far to disappear.",
                outcomeSpeaker: null,
                kind: "narration",
                lantern: -0.02,
                advance: false,
                retryText: "The arch asks again: not smaller, just gentler.",
            },
            {
                id: "help-see",
                tag: "Clarity",
                text: "Use them to help others see.",
                outcome: "The image becomes human-sized and warm. Power becomes a lantern, not a crown.",
                outcomeSpeaker: null,
                kind: "narration",
                lantern: 0.05,
                advance: true,
                event: { name: "three-tests:choice", payload: { archId: "power", accepted: true } },
            },
        ],
    },
];

export const THREE_TESTS_CLOSING = [
    { speaker: "Kavi", text: "You passed. Not perfectly, but you passed. The shame, the anger, the power. You looked at all of them." },
    { speaker: "You", text: "I did not conquer them. I just stayed with them differently." },
    { speaker: "Kavi", text: "That is the whole thing. The whole journey. Staying differently." },
];

export const FLIGHT_CURRENTS = [
    {
        id: "remembering",
        x: 0.22,
        y: 0.62,
        color: 0xfadb5f,
        surfaceLabel: "Asha's current",
        hiddenLabel: "Remembering lifts",
        line: "Asha's gift rises under you: one true memory, held like a wing.",
    },
    {
        id: "listening",
        x: 0.42,
        y: 0.38,
        color: 0x38bdf8,
        surfaceLabel: "Nadi's current",
        hiddenLabel: "Listening steers",
        line: "Nadi's gift turns the wind into a voice you can follow.",
    },
    {
        id: "warmth",
        x: 0.62,
        y: 0.58,
        color: 0xfb8500,
        surfaceLabel: "Soma's current",
        hiddenLabel: "Warmth protects",
        line: "Soma's fire keeps the height from becoming cold.",
    },
    {
        id: "bridge",
        x: 0.82,
        y: 0.34,
        color: 0xe2e8f0,
        surfaceLabel: "Rhea's current",
        hiddenLabel: "The unseen bridge holds",
        line: "Rhea's bridge appears under your feet only after you trust the next step.",
    },
];

export const FLIGHT_OPENING = [
    { speaker: null, kind: "narration", text: "The quiet center opens upward. The helpers' gifts become wind." },
    { speaker: "Kavi", text: "I have an important question. Are hearts supposed to fly?" },
    { speaker: "You", text: "Maybe only when they stop trying to carry everything alone." },
];

export const FLIGHT_CLOSING = [
    { speaker: "Kavi", text: "The road is gone below us. But I can still feel every step." },
    { speaker: "You", text: "Nothing was wasted. Even the heavy parts knew how to become wings." },
];

export const DRAGON_MEMORIES = [
    {
        id: "name",
        x: 0.18,
        surfaceLabel: "A true name",
        hiddenLabel: "I am not what fear called me",
        line: "The first memory answers: you have a name deeper than fear.",
    },
    {
        id: "child",
        x: 0.36,
        surfaceLabel: "A small hand",
        hiddenLabel: "The rescued self walks with me",
        line: "The second memory answers: the child was not abandoned.",
    },
    {
        id: "helpers",
        x: 0.58,
        surfaceLabel: "Four gifts",
        hiddenLabel: "I was helped and I helped back",
        line: "The third memory answers: no true journey was walked alone.",
    },
    {
        id: "listening",
        x: 0.76,
        surfaceLabel: "The deep hum",
        hiddenLabel: "I was heard before I could speak",
        line: "The fourth memory answers: the listening never left.",
    },
];

export const DRAGON_OPENING = [
    { speaker: null, kind: "narration", text: "At the highest dark, the Dragon of Forgetting waits with a mouth full of old names." },
    { speaker: "Dragon", text: "You are tired. Put the lantern down. Forget the road. Forget the child. Forget the helpers." },
    { speaker: "Kavi", text: "Absolutely not. We spent a long time remembering those." },
    { speaker: "You", text: "Then we remember again." },
];

export const DRAGON_CLOSING = [
    { speaker: "Dragon", text: "If you remember, I cannot keep you." },
    { speaker: "You", text: "Then let go." },
    { speaker: null, kind: "narration", text: "The dragon opens its mouth, and every stolen name returns as light." },
    { speaker: "Kavi", text: "That was terrifying. Also beautiful. Mostly terrifying. But beautiful." },
];

export const RETURN_CITIZENS = [
    {
        id: "worker",
        x: 0.26,
        surfaceLabel: "Still fine",
        hiddenLabel: "Afraid to stop",
        surface: "Everything is still fine. That is what we say here.",
        response: "You do not have to say it with me. You can breathe first.",
        blessing: "The citizen exhales. The dust around their feet remembers color.",
    },
    {
        id: "guard",
        x: 0.52,
        surfaceLabel: "Keep order",
        hiddenLabel: "Afraid of tenderness",
        surface: "A city survives by not feeling too much.",
        response: "A city survives when someone is allowed to feel enough.",
        blessing: "The guard lowers their hand. The gate behind them softens.",
    },
    {
        id: "child",
        x: 0.76,
        surfaceLabel: "Small watcher",
        hiddenLabel: "Still able to wonder",
        surface: "Did you bring something back?",
        response: "Yes. But it was also here. We only forgot where to look.",
        blessing: "The child smiles first. Then the city remembers how.",
    },
];

export const RETURN_OPENING = [
    { speaker: null, kind: "narration", text: "The road bends back to the City of Dust. Nothing has changed. Everything has changed." },
    { speaker: "Kavi", text: "It is strange. The streets look the same, but the silence does not." },
    { speaker: "You", text: "Maybe the silence was waiting for someone to return with an answer." },
];

export const RETURN_CLOSING = [
    { speaker: "Kavi", text: "The city is breathing." },
    { speaker: "You", text: "It was always able to. It just needed one lantern to remember the way." },
];

export const TREASURE_DIALOGUE = [
    { speaker: null, kind: "narration", text: "At the center of the city, the treasure waits where it has always been." },
    { speaker: "Kavi", text: "I do not see a chest. Or a crown. Or even a suspiciously shiny box." },
    { speaker: "You", text: "No. It is smaller than that." },
    { speaker: null, kind: "narration", text: "The chest-lantern opens. Inside is not gold, but the heart that survived forgetting." },
    { speaker: "Kavi", text: "Oh. That is much better than a box." },
    { speaker: "You", text: "The treasure was the awakened heart." },
    { speaker: null, kind: "narration", text: "And because it remembers itself, the whole world becomes a little easier to remember." },
];
