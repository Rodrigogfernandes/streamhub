export type Category =
  | 'Todos'
  | 'TV Aberta'
  | 'TV Fechada'
  | 'Filmes'
  | 'Séries'
  | 'Esportes'
  | 'Notícias'
  | 'Infantil'
  | 'Música'
  | 'Documentários'
  | 'Internacional';

export type AgeRating = 'L' | '10' | '12' | '14' | '16' | '18';

export interface Channel {
  id: string;
  name: string;
  logo: string;
  streamUrl: string;
  category: Category;
  country: string;
  language: string;
  isLive: boolean;
  viewers?: number;
  ageRating: AgeRating;
  description?: string;
  tags?: string[];
  isFeatured?: boolean;
  currentProgram?: string;
  nextProgram?: string;
}

export interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  year: number;
  duration: number; // minutes
  rating: number;   // 0-10
  ageRating: AgeRating;
  genres: string[];
  description: string;
  streamUrl: string;
  isFeatured?: boolean;
  isNew?: boolean;
}

export interface Serie {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  seasons: number;
  rating: number;
  ageRating: AgeRating;
  genres: string[];
  description: string;
  isFeatured?: boolean;
  isNew?: boolean;
}

export type ContentItem = Channel | Movie | Serie;

export interface HeroItem {
  id: string;
  title: string;
  description: string;
  backdrop: string;
  type: 'channel' | 'movie' | 'serie';
  ageRating: AgeRating;
  genres: string[];
  streamUrl?: string;
}
