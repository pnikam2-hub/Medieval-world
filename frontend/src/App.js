import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "@/App.css";
import TitleScreen from "@/pages/TitleScreen";
import CharacterScreen from "@/pages/CharacterScreen";
import ChapterMapScreen from "@/pages/ChapterMapScreen";
import GameScreen from "@/pages/GameScreen";
import JournalScreen from "@/pages/JournalScreen";
import ThresholdScreen from "@/pages/ThresholdScreen";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<TitleScreen />} />
                <Route path="/character" element={<CharacterScreen />} />
                <Route path="/map" element={<ChapterMapScreen />} />
                <Route path="/game/:chapterId" element={<GameScreen />} />
                <Route
                    path="/journal/:chapterId"
                    element={<JournalScreen />}
                />
                <Route path="/threshold" element={<ThresholdScreen />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
