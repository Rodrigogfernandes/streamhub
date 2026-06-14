import { api } from './api';
import { HERO_ITEMS, CHANNELS, MOVIES } from '../constants/mockData';
import { Channel, Movie, Serie, HeroItem, ContentItem } from '../types';

// Dados mockados de séries para enriquecer a experiência local
export const MOCK_SERIES: Serie[] = [
  {
    id: 's1',
    title: 'The Last of Us',
    poster: 'https://image.tmdb.org/t/p/w500/uDgy6hyPd1To1g4xyzBbktOQ8WL.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/uDgy6hyPd1To1g4xyzBbktOQ8WL.jpg',
    seasons: 1,
    rating: 8.8,
    ageRating: '16',
    genres: ['Drama', 'Terror', 'Ação'],
    description: 'Um sobrevivente endurecido atravessa o que restou dos EUA com uma garota que pode ser a última esperança da humanidade.',
    isFeatured: true,
  },
  {
    id: 's2',
    title: 'House of the Dragon',
    poster: 'https://image.tmdb.org/t/p/w500/z2yJ1r0v24c16r8rbR4cy8i966C.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/etj8E2o0n07ZE3Z2IKZLLt68t9y.jpg',
    seasons: 2,
    rating: 8.5,
    ageRating: '16',
    genres: ['Drama', 'Ação', 'Fantasia'],
    description: 'A história da guerra civil da Casa Targaryen que ocorreu 200 anos antes dos eventos de Game of Thrones.',
    isNew: true,
  },
  {
    id: 's3',
    title: 'Breaking Bad',
    poster: 'https://image.tmdb.org/t/p/w500/gg4zCoXAFcu8n1KmITayw456Qj.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/tsRy63MuTJClv198c6jECeh5nPP.jpg',
    seasons: 5,
    rating: 9.5,
    ageRating: '18',
    genres: ['Drama', 'Crime'],
    description: 'Um professor de química do ensino médio diagnosticado com câncer de pulmão terminal se junta a um ex-aluno para fabricar e vender metanfetamina.',
  }
];

async function getFeatured(): Promise<HeroItem[]> {
  try {
    const response = await api.get<HeroItem[]>('/content/featured');
    return response.data;
  } catch (error) {
    console.log('[ContentService] getFeatured falhou, usando mock local.');
    return HERO_ITEMS;
  }
}

async function getChannels(category?: string): Promise<Channel[]> {
  try {
    const params = category && category !== 'Todos' ? { category } : {};
    const response = await api.get<Channel[]>('/channels', { params });
    return response.data;
  } catch (error) {
    console.log('[ContentService] getChannels falhou, usando mock local.');
    if (category && category !== 'Todos') {
      return CHANNELS.filter(c => c.category === category);
    }
    return CHANNELS;
  }
}

async function getMovies(genre?: string, sortBy?: string): Promise<Movie[]> {
  try {
    const params = {
      ...(genre && genre !== 'Todos' ? { genre } : {}),
      ...(sortBy ? { sortBy } : {}),
    };
    const response = await api.get<Movie[]>('/movies', { params });
    return response.data;
  } catch (error) {
    console.log('[ContentService] getMovies falhou, usando mock local.');
    let result = [...MOVIES];
    if (genre && genre !== 'Todos') {
      result = result.filter(m => m.genres.includes(genre));
    }
    if (sortBy) {
      switch (sortBy) {
        case 'Nota': result.sort((a, b) => b.rating - a.rating); break;
        case 'Ano': result.sort((a, b) => b.year - a.year); break;
        case 'Duração': result.sort((a, b) => b.duration - a.duration); break;
      }
    }
    return result;
  }
}

async function getSeries(genre?: string, sortBy?: string): Promise<Serie[]> {
  try {
    const params = {
      ...(genre && genre !== 'Todos' ? { genre } : {}),
      ...(sortBy ? { sortBy } : {}),
    };
    const response = await api.get<Serie[]>('/series', { params });
    return response.data;
  } catch (error) {
    console.log('[ContentService] getSeries falhou, usando mock local.');
    let result = [...MOCK_SERIES];
    if (genre && genre !== 'Todos') {
      result = result.filter(s => s.genres.includes(genre));
    }
    if (sortBy) {
      switch (sortBy) {
        case 'Nota': result.sort((a, b) => b.rating - a.rating); break;
      }
    }
    return result;
  }
}

async function searchContent(query: string): Promise<ContentItem[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const response = await api.get<ContentItem[]>('/content/search', { params: { q: query } });
    return response.data;
  } catch (error) {
    console.log('[ContentService] searchContent falhou, usando mock local.');
    const q = query.toLowerCase();
    const matchedMovies = MOVIES
      .filter((m) => m.title.toLowerCase().includes(q) || m.genres.some(g => g.toLowerCase().includes(q)))
      .map(m => ({ ...m, kind: 'movie' as const }));
    const matchedChannels = CHANNELS
      .filter((c) => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q))
      .map(c => ({ ...c, kind: 'channel' as const }));
    const matchedSeries = MOCK_SERIES
      .filter((s) => s.title.toLowerCase().includes(q) || s.genres.some(g => g.toLowerCase().includes(q)))
      .map(s => ({ ...s, kind: 'serie' as const }));
    
    return [...matchedMovies, ...matchedChannels, ...matchedSeries] as unknown as ContentItem[];
  }
}

export const ContentService = {
  getFeatured,
  getChannels,
  getMovies,
  getSeries,
  searchContent,
};
