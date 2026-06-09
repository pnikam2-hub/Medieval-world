import { useSyncExternalStore } from "react";

const STORAGE_KEY = "heartbound.save.v1";

const defaultState = {
    hero: { preset: "arin", name: "Arin", accent: "gold" },
    lantern: 0.15, // 0..1 awareness
    currentChapter: 1,
    completedChapters: [], // ids
    journal: {}, // { chapterId: noteText }
    unlockedQualities: [], // ['truthful-response', 'presence']
    mirrorLensUnlocked: true, // preview from chapter 1 onward
    mirrorLensTooltipShown: false, // one-time first-use tooltip
    hasSave: false,
};

function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { ...defaultState };
        const parsed = JSON.parse(raw);
        return { ...defaultState, ...parsed, hasSave: true };
    } catch (e) {
        return { ...defaultState };
    }
}

let state = load();
const subscribers = new Set();

function persist() {
    try {
        const toSave = { ...state, hasSave: true };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
        // ignore quota errors
    }
}

function emit() {
    subscribers.forEach((cb) => cb());
}

function subscribe(cb) {
    subscribers.add(cb);
    return () => subscribers.delete(cb);
}

function getSnapshot() {
    return state;
}

export const gameStore = {
    get: getSnapshot,
    set(partial) {
        state = { ...state, ...partial };
        persist();
        emit();
    },
    adjustLantern(delta) {
        const next = Math.max(0, Math.min(1, state.lantern + delta));
        state = { ...state, lantern: next };
        persist();
        emit();
    },
    completeChapter(id) {
        const completed = Array.from(new Set([...state.completedChapters, id]));
        state = {
            ...state,
            completedChapters: completed,
            currentChapter: Math.min(23, Math.max(state.currentChapter, id + 1)),
        };
        persist();
        emit();
    },
    saveJournalNote(chapterId, note) {
        state = {
            ...state,
            journal: { ...state.journal, [chapterId]: note },
        };
        persist();
        emit();
    },
    unlockQuality(name) {
        if (state.unlockedQualities.includes(name)) return;
        state = {
            ...state,
            unlockedQualities: [...state.unlockedQualities, name],
        };
        persist();
        emit();
    },
    setHero(hero) {
        state = { ...state, hero: { ...state.hero, ...hero } };
        persist();
        emit();
    },
    reset() {
        state = { ...defaultState };
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            // ignore
        }
        emit();
    },
};

export function useGameStore() {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
