export type Place = {
  id: string;
  title: string;
  comment: string;
  latitude?: number;
  longitude?: number;
  createdAt: number;
};

export type Note = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
};

export type ThemeMode = 'light' | 'dark';
