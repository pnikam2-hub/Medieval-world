import {
    CITIZENS,
    KAVI_DIALOGUE,
    MURAL_DIALOGUE,
    SHADOW_DIALOGUE,
    TARA_DIALOGUE,
} from "@/game/chapters";

// Speaker name -> hidden emotional truth revealed under Mirror Lens
export const SPEAKER_HIDDEN_LABELS = {
    Tara: "Myth keeper",
    "Mural Voice": "A door, a memory",
    "Shadow Twin": "Wounded, protective self",
    Kavi: "Loyal companion",
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
