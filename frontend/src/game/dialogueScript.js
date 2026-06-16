import {
    APOTHEOSIS_DIALOGUE,
    COURAGE_CLOSING,
    COURAGE_FEAR_OBJECTS,
    COURAGE_OPENING,
    CITIZENS,
    DEEP_LISTEN_CLOSING,
    DEEP_LISTEN_FRAGMENTS,
    DEEP_LISTEN_OPENING,
    HELPER_RETURN_GIFTS,
    HELPERS_RETURN_CLOSING,
    HELPERS_RETURN_OPENING,
    INITIATION_CLOSING_DIALOGUE,
    INITIATION_OPENING_DIALOGUE,
    INITIATION_STONES,
    INITIATION_WELL_DIALOGUE,
    INWARD_THRESHOLD_ARRIVAL,
    INWARD_THRESHOLD_OPENING,
    LONG_DARK_ECHOES,
    LONG_DARK_EXIT_DIALOGUE,
    LONG_DARK_OPENING,
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
    RESCUE_CLOSING,
    RESCUE_DIALOGUE,
    RESCUE_OPENING,
    SEA_CLOSING_DIALOGUE,
    SEA_OPENING_LINES,
    THREE_TEST_ARCHES,
    THREE_TESTS_CLOSING,
    THREE_TESTS_OPENING,
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
    "The Well": "A chamber learning to answer",
    "The Vastness": "What was never wounded",
    Veer: "What stays when everything else runs",
    "Younger Self": "Still waiting to be remembered",
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
            {
                speaker: "Kavi",
                text: stone.kaviLine,
            },
        ];
    }
    if (payload.name === "initiation-closing") {
        return [...INITIATION_WELL_DIALOGUE, ...INITIATION_CLOSING_DIALOGUE].map(
            withSpeakerLabel
        );
    }
    if (payload.name === "inward-threshold-opening") {
        return INWARD_THRESHOLD_OPENING.map(withSpeakerLabel);
    }
    if (payload.name === "inward-threshold-arrival") {
        return INWARD_THRESHOLD_ARRIVAL.map(withSpeakerLabel);
    }
    if (payload.name === "apotheosis-dialogue") {
        return APOTHEOSIS_DIALOGUE.map(withSpeakerLabel);
    }
    if (payload.name === "long-dark-opening") {
        return LONG_DARK_OPENING.map(withSpeakerLabel);
    }
    if (payload.name === "long-dark-echo") {
        const echo = LONG_DARK_ECHOES.find((x) => x.id === payload.echoId);
        if (!echo) return null;
        return [
            { speaker: null, kind: "narration", text: echo.fragment },
            ...(echo.kaviLine ? [{ speaker: "Kavi", text: echo.kaviLine }] : []),
        ].map(withSpeakerLabel);
    }
    if (payload.name === "long-dark-exit") {
        return LONG_DARK_EXIT_DIALOGUE.map(withSpeakerLabel);
    }
    if (payload.name === "courage-opening") {
        return COURAGE_OPENING.map(withSpeakerLabel);
    }
    if (payload.name === "courage-fear") {
        const fear = COURAGE_FEAR_OBJECTS.find((x) => x.id === payload.fearId);
        if (!fear) return null;
        return [{ speaker: "Veer", text: fear.veerLine }].map(withSpeakerLabel);
    }
    if (payload.name === "courage-closing") {
        return COURAGE_CLOSING.map(withSpeakerLabel);
    }
    if (payload.name === "helpers-return-opening") {
        return HELPERS_RETURN_OPENING.map(withSpeakerLabel);
    }
    if (payload.name === "helpers-return-gift") {
        const helper = HELPER_RETURN_GIFTS.find((x) => x.id === payload.helperId);
        if (!helper) return null;
        return helper.lines.map((text) =>
            withSpeakerLabel({
                speaker: helper.name,
                text,
            })
        );
    }
    if (payload.name === "helpers-return-closing") {
        return HELPERS_RETURN_CLOSING.map(withSpeakerLabel);
    }
    if (payload.name === "deep-listen-opening") {
        return DEEP_LISTEN_OPENING.map(withSpeakerLabel);
    }
    if (payload.name === "deep-listen-pulse") {
        const text = DEEP_LISTEN_FRAGMENTS[payload.index] || DEEP_LISTEN_FRAGMENTS[0];
        return [{ speaker: null, kind: "narration", text }].map(withSpeakerLabel);
    }
    if (payload.name === "deep-listen-closing") {
        return DEEP_LISTEN_CLOSING.map(withSpeakerLabel);
    }
    if (payload.name === "rescue-opening") {
        return RESCUE_OPENING.map(withSpeakerLabel);
    }
    if (payload.name === "rescue-dialogue") {
        return RESCUE_DIALOGUE.map(withSpeakerLabel);
    }
    if (payload.name === "rescue-closing") {
        return RESCUE_CLOSING.map(withSpeakerLabel);
    }
    if (payload.name === "three-tests-opening") {
        return THREE_TESTS_OPENING.map(withSpeakerLabel);
    }
    if (payload.name === "three-test-arch") {
        const arch = THREE_TEST_ARCHES.find((x) => x.id === payload.archId);
        if (!arch) return null;
        return [
            {
                speaker: null,
                kind: "narration",
                text: arch.prompt,
                choice: {
                    prompt: "Choose how the hero carries what they know.",
                    options: arch.choices,
                },
            },
        ].map(withSpeakerLabel);
    }
    if (payload.name === "three-tests-closing") {
        return THREE_TESTS_CLOSING.map(withSpeakerLabel);
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
