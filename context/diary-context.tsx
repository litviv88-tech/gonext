import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { loadNotes, loadPlaces, saveNotes, savePlaces } from '@/lib/storage';
import type { Note, Place } from '@/types/diary';

type PlaceDraft = {
  title: string;
  comment?: string;
  latitude?: number;
  longitude?: number;
};

type NoteDraft = {
  title: string;
  body: string;
};

type DiaryContextValue = {
  ready: boolean;
  places: Place[];
  notes: Note[];
  addPlace: (draft: PlaceDraft) => Place;
  updatePlace: (id: string, draft: PlaceDraft) => void;
  removePlace: (id: string) => void;
  addNote: (draft: NoteDraft) => void;
  updateNote: (id: string, draft: NoteDraft) => void;
  removeNote: (id: string) => void;
};

const DiaryContext = createContext<DiaryContextValue | null>(null);

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function DiaryProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    Promise.all([loadPlaces(), loadNotes()]).then(([savedPlaces, savedNotes]) => {
      setPlaces(savedPlaces);
      setNotes(savedNotes);
      setReady(true);
    });
  }, []);

  const persistPlaces = useCallback((next: Place[]) => {
    setPlaces(next);
    savePlaces(next);
  }, []);

  const persistNotes = useCallback((next: Note[]) => {
    setNotes(next);
    saveNotes(next);
  }, []);

  const addPlace = useCallback(
    (draft: PlaceDraft) => {
      const place: Place = {
        id: createId(),
        title: draft.title.trim(),
        comment: draft.comment?.trim() ?? '',
        latitude: draft.latitude,
        longitude: draft.longitude,
        createdAt: Date.now(),
      };
      persistPlaces([place, ...places]);
      return place;
    },
    [persistPlaces, places],
  );

  const updatePlace = useCallback(
    (id: string, draft: PlaceDraft) => {
      persistPlaces(
        places.map((place) =>
          place.id === id
            ? {
                ...place,
                title: draft.title.trim(),
                comment: draft.comment?.trim() ?? '',
                latitude: draft.latitude,
                longitude: draft.longitude,
              }
            : place,
        ),
      );
    },
    [persistPlaces, places],
  );

  const removePlace = useCallback(
    (id: string) => {
      persistPlaces(places.filter((place) => place.id !== id));
    },
    [persistPlaces, places],
  );

  const addNote = useCallback(
    (draft: NoteDraft) => {
      const note: Note = {
        id: createId(),
        title: draft.title.trim(),
        body: draft.body.trim(),
        createdAt: Date.now(),
      };
      persistNotes([note, ...notes]);
    },
    [notes, persistNotes],
  );

  const updateNote = useCallback(
    (id: string, draft: NoteDraft) => {
      persistNotes(
        notes.map((note) =>
          note.id === id
            ? {
                ...note,
                title: draft.title.trim(),
                body: draft.body.trim(),
              }
            : note,
        ),
      );
    },
    [notes, persistNotes],
  );

  const removeNote = useCallback(
    (id: string) => {
      persistNotes(notes.filter((note) => note.id !== id));
    },
    [notes, persistNotes],
  );

  const value = useMemo(
    () => ({
      ready,
      places,
      notes,
      addPlace,
      updatePlace,
      removePlace,
      addNote,
      updateNote,
      removeNote,
    }),
    [addNote, addPlace, notes, places, ready, removeNote, removePlace, updateNote, updatePlace],
  );

  return <DiaryContext.Provider value={value}>{children}</DiaryContext.Provider>;
}

export function useDiary() {
  const value = useContext(DiaryContext);
  if (!value) {
    throw new Error('useDiary должен вызываться внутри DiaryProvider');
  }
  return value;
}
