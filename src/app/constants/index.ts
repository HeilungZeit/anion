import { AnimeQueryI } from '../interfaces/queries.types';

export const BASE_SHIKIMORI_URL = 'https://shikimori.one';

export const DEFAULT_QUERY: AnimeQueryI = {
  offset: 0,
  limit: 22,
  status: ['ongoing'],
  types: ['tv', 'ova', 'movie'],
  sortForward: true,
};
