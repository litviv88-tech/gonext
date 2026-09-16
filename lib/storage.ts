import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Note, Place, ThemeMode } from '@/types/diary';

const PLACES_KEY = 'tourist-diary/places';
const NOTES_KEY = 'tourist-diary/notes';
const THEME_KEY = 'tourist-diary/theme';

async function readJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function loadPlaces(): Promise<Place[]> {
  return readJson<Place[]>(PLACES_KEY, []);
}

export async function savePlaces(places: Place[]): Promise<void> {
  await AsyncStorage.setItem(PLACES_KEY, JSON.stringify(places));
}

export async function loadNotes(): Promise<Note[]> {
  return readJson<Note[]>(NOTES_KEY, []);
}

export async function saveNotes(notes: Note[]): Promise<void> {
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export async function loadThemeMode(): Promise<ThemeMode | null> {
  const value = await AsyncStorage.getItem(THEME_KEY);
  return value === 'light' || value === 'dark' ? value : null;
}

export async function saveThemeMode(mode: ThemeMode): Promise<void> {
  await AsyncStorage.setItem(THEME_KEY, mode);
}
