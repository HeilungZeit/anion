import {
  Anime,
  AnimeBasic,
  AnimeRelation,
  AnimesParams,
  AnimesTopicsParams,
  ExternalLink,
  Franchise,
  Id,
  Role,
  Screenshot,
  Topic,
} from 'node-shikimori';

export interface AnimeClient {
  list: (params: AnimesParams) => Promise<AnimeBasic[]>;
  byId: ({ id }: Id<number>) => Promise<Anime>;
  roles: ({ id }: Id<number>) => Promise<Role[]>;
  similar: ({ id }: Id<number>) => Promise<AnimeBasic[]>;
  related: ({ id }: Id<number>) => Promise<AnimeRelation[]>;
  screenshots: ({ id }: Id<number>) => Promise<Screenshot[]>;
  franchise: ({ id }: Id<number>) => Promise<Franchise>;
  externalLinks: ({ id }: Id<number>) => Promise<ExternalLink[]>;
  topics: ({
    id,
    ...params
  }: AnimesTopicsParams) => Promise<Topic<AnimeBasic>[]>;
}

export type Seasons = 'winter' | 'spring' | 'summer' | 'fall';
