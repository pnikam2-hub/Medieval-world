import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gameStore } from "@/game/useGameStore";

const PRESETS = [
    {
        id: "arin",
        name: "Arin",
        line: "Sensitive, quietly curious. Begins emotionally numb.",
    },
    {
        id: "mira",
        name: "Mira",
        line: "Sharp, watchful. Carries a question she has never spoken aloud.",
    },
    {
        id: "custom",
        name: "Custom",
        line: "Choose your own name. The cave is patient.",
    },
];

const ACCENTS = [
    { id: "gold", name: "Gold", color: "#fadb5f", line: "Warmth remembered" },
    { id: "ember", name: "Ember", color: "#fb8500", line: "Stubborn flame" },
    {
        id: "moon",
        name: "Moonlight",
        color: "#e2e8f0",
        line: "Cool, clarifying",
    },
];

export default function CharacterScreen() {
    const navigate = useNavigate();
    const [preset, setPreset] = useState("arin");
    const [name, setName] = useState("Arin");
    const [accent, setAccent] = useState("gold");

    const pickPreset = (p) => {
        setPreset(p.id);
        if (p.id !== "custom") setName(p.name);
        else setName("");
    };

    const begin = () => {
        const finalName = (name || "Arin").trim() || "Arin";
        gameStore.set({
            hero: { preset, name: finalName, accent },
            currentChapter: 1,
        });
        navigate("/map");
    };

    return (
        <div
            className="App vignette grain"
            data-testid="character-screen"
            style={{
                background:
                    "radial-gradient(ellipse at 25% 75%, #1a1612 0%, #060606 70%)",
            }}
        >
            <div className="relative z-10 h-full w-full flex flex-col md:flex-row">
                {/* Left side - portrait */}
                <div className="flex-1 flex items-center justify-center p-8 relative">
                    <div className="relative">
                        <div
                            className="w-44 h-44 md:w-64 md:h-64 rounded-full"
                            style={{
                                background: `radial-gradient(circle, ${ACCENTS.find((a) => a.id === accent).color}33, transparent 65%)`,
                            }}
                        />
                        <div
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 heart-meter animate-breathe"
                            style={{
                                width: 40,
                                height: 40,
                                background: `radial-gradient(circle, ${ACCENTS.find((a) => a.id === accent).color} 0%, transparent 70%)`,
                                boxShadow: `0 0 30px ${ACCENTS.find((a) => a.id === accent).color}80`,
                            }}
                        />
                        <svg
                            viewBox="0 0 100 160"
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-52 md:w-40 md:h-60 opacity-90"
                        >
                            <circle cx="50" cy="32" r="14" fill="#1d1d1d" />
                            <path
                                d="M30 50 Q50 42 70 50 L72 110 Q50 116 28 110 Z"
                                fill="#1d1d1d"
                            />
                            <rect
                                x="34"
                                y="110"
                                width="12"
                                height="36"
                                fill="#1d1d1d"
                            />
                            <rect
                                x="54"
                                y="110"
                                width="12"
                                height="36"
                                fill="#1d1d1d"
                            />
                        </svg>
                    </div>
                </div>

                {/* Right side - form */}
                <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-8 max-w-2xl">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-amber-200/70 font-mythic">
                        Step One
                    </p>
                    <h1 className="font-mythic text-4xl md:text-5xl text-neutral-50 mt-1 mb-1">
                        Who walks in?
                    </h1>
                    <p className="text-neutral-400 text-sm md:text-base mb-8">
                        Choose a hero, give them a name, choose how your
                        heart-lantern glows.
                    </p>

                    <div className="mb-6">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-2">
                            Hero
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {PRESETS.map((p) => (
                                <button
                                    key={p.id}
                                    data-testid={`preset-${p.id}`}
                                    onClick={() => pickPreset(p)}
                                    className={`crystal text-left rounded-sm px-3 py-3 border transition-all duration-300 ${preset === p.id ? "border-amber-400/70 text-amber-100" : "border-white/10 text-neutral-300 hover:border-amber-400/40"}`}
                                >
                                    <p className="font-mythic text-xl">
                                        {p.name}
                                    </p>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mt-1 leading-snug">
                                        {p.line}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label
                            className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-2 block"
                            htmlFor="hero-name"
                        >
                            Name
                        </label>
                        <input
                            id="hero-name"
                            data-testid="hero-name-input"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value.slice(0, 24))
                            }
                            placeholder="Speak your name"
                            className="crystal w-full rounded-sm bg-transparent border border-white/10 px-4 py-3 font-mythic text-2xl text-amber-100 placeholder:text-neutral-600 focus:border-amber-400/60 transition-all"
                        />
                    </div>

                    <div className="mb-10">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-2">
                            Lantern accent
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {ACCENTS.map((a) => (
                                <button
                                    key={a.id}
                                    data-testid={`accent-${a.id}`}
                                    onClick={() => setAccent(a.id)}
                                    className={`crystal rounded-sm px-3 py-3 border transition-all duration-300 ${accent === a.id ? "border-amber-400/70" : "border-white/10 hover:border-amber-400/40"}`}
                                >
                                    <div
                                        className="w-6 h-6 rounded-full mx-auto"
                                        style={{
                                            background: `radial-gradient(circle, ${a.color}, transparent 70%)`,
                                            boxShadow: `0 0 20px ${a.color}`,
                                        }}
                                    />
                                    <p className="font-mythic text-base text-neutral-100 mt-2">
                                        {a.name}
                                    </p>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mt-1">
                                        {a.line}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            className="dim-link font-mythic text-xl"
                            onClick={() => navigate("/")}
                            data-testid="character-back-button"
                        >
                            ◂ Back
                        </button>
                        <button
                            className="dim-link font-mythic text-2xl text-amber-100"
                            onClick={begin}
                            data-testid="enter-antara-button"
                        >
                            Enter Antara ▸
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
