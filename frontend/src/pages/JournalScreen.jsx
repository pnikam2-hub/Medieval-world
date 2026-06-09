import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CHAPTERS } from "@/game/chapters";
import { gameStore, useGameStore } from "@/game/useGameStore";

function JournalContent({ id, initialNote, chapter, textSize }) {
    const navigate = useNavigate();
    const [note, setNote] = useState(initialNote);

    const promptClass =
        textSize === "sm"
            ? "text-xl md:text-2xl"
            : textSize === "lg"
              ? "text-3xl md:text-4xl"
              : "text-2xl md:text-3xl";
    const inputClass =
        textSize === "sm"
            ? "text-base"
            : textSize === "lg"
              ? "text-2xl"
              : "text-lg";

    const save = () => {
        gameStore.saveJournalNote(id, note.trim());
        if (id < 5) {
            navigate("/map");
        } else {
            navigate("/threshold");
        }
    };

    const skip = () => {
        if (id < 5) navigate("/map");
        else navigate("/threshold");
    };

    return (
        <div
            className="App vignette grain"
            data-testid="journal-screen"
            style={{
                background:
                    "radial-gradient(ellipse at 30% 70%, #1c1714 0%, #060606 65%)",
            }}
        >
            <div className="relative z-10 h-full max-w-5xl mx-auto px-6 md:px-12 py-10 md:py-16 flex flex-col">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-amber-200/70 font-mythic">
                        Chapter {chapter.id} · Consciousness Journal
                    </p>
                    <h1 className="font-mythic text-4xl md:text-5xl text-neutral-50 mt-2 leading-tight">
                        {chapter.endText || "Sit a moment. Listen inward."}
                    </h1>
                </div>

                <div className="grid md:grid-cols-2 gap-10 mt-12 flex-1">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-500">
                            Reflection prompt
                        </p>
                        <p
                            className={`font-mythic italic ${promptClass} text-amber-100/90 mt-3 leading-snug`}
                            data-testid="journal-prompt"
                        >
                            &ldquo;{chapter.journalQuestion}&rdquo;
                        </p>
                        <p className="text-neutral-500 text-sm mt-6 leading-relaxed">
                            Your note is saved only on this device. You can
                            skip &mdash; the journey will not lecture you.
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <textarea
                            data-testid="journal-input"
                            className={`crystal flex-1 min-h-[200px] md:min-h-[260px] bg-transparent border border-white/10 rounded-sm px-4 py-3 font-mythic ${inputClass} text-amber-50/90 placeholder:text-neutral-600 focus:border-amber-400/60 leading-relaxed`}
                            value={note}
                            onChange={(e) =>
                                setNote(e.target.value.slice(0, 1500))
                            }
                            placeholder="Write your private reflection here..."
                        />
                        <div className="flex items-center justify-end gap-6 mt-6">
                            <button
                                className="dim-link font-mythic text-xl"
                                onClick={skip}
                                data-testid="journal-skip-button"
                            >
                                Skip
                            </button>
                            <button
                                className="dim-link font-mythic text-2xl text-amber-100"
                                onClick={save}
                                data-testid="journal-save-button"
                            >
                                Save &amp; continue ▸
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function JournalScreen() {
    const { chapterId } = useParams();
    const state = useGameStore();
    const id = parseInt(chapterId, 10) || 1;
    const chapter = CHAPTERS.find((c) => c.id === id) || CHAPTERS[0];
    const initialNote = state.journal[id] || "";
    return (
        <JournalContent
            key={id}
            id={id}
            initialNote={initialNote}
            chapter={chapter}
            textSize={state.journalTextSize || "md"}
        />
    );
}
