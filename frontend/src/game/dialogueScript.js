import {
    CITIZENS,
    INITIATION_CLOSING_DIALOGUE,
    INITIATION_OPENING_DIALOGUE,
    INITIATION_STONES,
    KAVI_DIALOGUE,
    MURAL_DIALOGUE,
    SHADOW_DIALOGUE,
    TARA_DIALOGUE,
    TARA_LENS_CLOSING,
    TARA_LENS_DIALOGUE,
    TRIAL_FIRES,
    TRIAL_OPENING_DIALOGUE,
    MEMORY_BUOYS,
    RIVER_CLOSING_DIALOGUE,
    RIVER_HELPERS,
    RIVER_OPENING_DIALOGUE,
    SEA_CLOSING_DIALOGUE,
    SEA_OPENING_LINES,
} from "@/game/chapters";

// Speaker name -> hidden emotional truth revealed under Mirror Lens
export const SPEAKER_HIDDEN_LABELS = {
    Tara: "Myth keeper",
    "Mural Voice": "A door, a memory",
    "Shadow Twin": "Wounded, protective self",
    Kavi: "Loyal companion",
    Asha: "Remembers for others",
    Nadi: "Listens beneath the current",
    Soma: "Keeps fire through fear",
    Rhea: "Builds what was once burned",
};

export const TARA_CHOICE_BLOCK =
    TARA_DIALOGUE[TARA_DIALOGUE.length - 1].choice;

function withSpeakerLabel(line) {
    return {
        ...line,
        hiddenLabel:
            line.hiddenLabel ||
            (line.speaker && SPEAKER_HIDDEN_LABELS[line.speaker]) ||
            null,
    };
}

export function buildScript(payload) {
    if (!payload) return null;
    if (payload.name === "citizen") {
        const c = CITIZENS.find((x) => x.id === payload.npcId);
        if (!c) return null;
        return [
            {
                speaker: c.label,
                hiddenLabel: c.hiddenLabel,
                text: c.surface,
                kind: "speech",
            },
            { speaker: "You", text: c.response, kind: "speech" },
            {
                speaker: c.label,
                hiddenLabel: c.hiddenLabel,
                text: `(Beneath the surface) ${c.hidden}`,
                kind: "speech",
                mirrorOnly: true,
            },
        ];
    }
    if (payload.name === "mural-dialogue") {
        return MURAL_DIALOGUE.map(withSpeakerLabel);
    }
    if (payload.name === "tara-dialogue") {
        return [
            ...TARA_DIALOGUE,
            {
                speaker: "Tara",
                text: "Rest now. The road begins at sunrise.",
                kind: "speech",
            },
        ].map(withSpeakerLabel);
    }
    if (payload.name === "kavi-dialogue") {
        return KAVI_DIALOGUE.map(withSpeakerLabel);
    }
    if (payload.name === "tara-lens-dialogue") {
        return TARA_LENS_DIALOGUE.map(withSpeakerLabel);
    }
    if (payload.name === "tara-lens-closing") {
        return TARA_LENS_CLOSING.map(withSpeakerLabel);
    }
    if (payload.name === "trial-opening") {
        return TRIAL_OPENING_DIALOGUE.map(withSpeakerLabel);
    }
    if (payload.name === "trial-fire") {
        const fire = TRIAL_FIRES.find((x) => x.id === payload.fireId);
        if (!fire) return null;
        return [
            {
                speaker: null,
                text: fire.prompt,
                kind: "narration",
                choice: {
                    prompt: "Answer the fire with the kind of hero you are becoming.",
                    options: fire.choices.map((option) =>
                        option.advance
                            ? {
                                  ...option,
                                  afterLines: [
                                      {
                                          speaker: "Kavi",
                                          hiddenLabel:
                                              SPEAKER_HIDDEN_LABELS.Kavi,
                                          text: fire.afterLine,
                                      },
                                  ],
                              }
                            : option
                    ),
                },
            },
        ];
    }
    if (payload.name === "sea-opening") {
        return SEA_OPENING_LINES.map(withSpeakerLabel);
    }
    if (payload.name === "memory-buoy") {
        const buoy = MEMORY_BUOYS.find((x) => x.id === payload.buoyId);
        if (!buoy) return null;
        return [
            {
                speaker: null,
                kind: "narration",
                text: `(The buoy remembers) ${buoy.memory}`,
            },
        ];
    }
    if (payload.name === "sea-closing") {
        return SEA_CLOSING_DIALOGUE.map(withSpeakerLabel);
    }
    if (payload.name === "river-opening") {
        return RIVER_OPENING_DIALOGUE.map(withSpeakerLabel);
    }
    if (payload.name === "river-helper") {
        const helper = RIVER_HELPERS.find((x) => x.id === payload.helperId);
        if (!helper) return null;
        return helper.lines.map((text) =>
            withSpeakerLabel({
                speaker: helper.name,
                text,
            })
        );
    }
    if (payload.name === "river-closing") {
        return RIVER_CLOSING_DIALOGUE.map(withSpeakerLabel);
    }
    if (payload.name === "initiation-opening") {
        return INITIATION_OPENING_DIALOGUE.map(withSpeakerLabel);
    }
    if (payload.name === "initiation-stone") {
        const stone = INITIATION_STONES.find((x) => x.id === payload.stoneId);
        if (!stone) return null;
        return [
            {
                speaker: null,
                kind: "narration",
                text: `(The chamber names it) ${stone.line}`,
            },
        ];
    }
    if (payload.name === "initiation-closing") {
        return INITIATION_CLOSING_DIALOGUE.map(withSpeakerLabel);
    }
    if (payload.name === "shadow-dialogue") {
        return [
            ...SHADOW_DIALOGUE,
            {
                speaker: null,
                text: "(The Shadow Twin steps aside. The fear field stirs awake.)",
                kind: "narration",
            },
        ].map(withSpeakerLabel);
    }
    return null;
}
