import {
  AnimeBasic,
  AnimeKind,
  AnimeOrder,
  AnimesParams,
} from 'node-shikimori';

import { AnimeClient, Seasons } from './interfaces/anime.interface';

export class AnimeBuilder {
  constructor(private readonly animeClient: AnimeClient) {}

  private params: AnimesParams = {
    limit: 10,
  };

  withIds(ids: string): AnimeBuilder {
    this.params.ids = ids;
    return this;
  }

  withScore(score: number): AnimeBuilder {
    this.params.score = score;
    return this;
  }

  withSearch(term: string): AnimeBuilder {
    this.params.search = term;
    return this;
  }

  withLimit(limit: number): AnimeBuilder {
    this.params.limit = limit;
    return this;
  }

  withPage(page: number): AnimeBuilder {
    this.params.page = page;
    return this;
  }

  withSeason(
    year: string,
    season?: Seasons,
    yearsRange?: string[]
  ): AnimeBuilder {
    this.params.season = this.buildSeason({ year, season, yearsRange });
    return this;
  }

  withOrder(order: AnimeOrder): AnimeBuilder {
    this.params.order = order;
    return this;
  }

  withKind(kind: AnimeKind): AnimeBuilder {
    this.params.kind = kind;
    return this;
  }

  private buildSeason({
    year,
    season,
    yearsRange,
  }: {
    year: string;
    season?: Seasons;
    yearsRange?: string[];
  }): string {
    if (season && !yearsRange) {
      return `${season}_${year}`;
    }

    if (yearsRange && !season) {
      return yearsRange.join('_');
    }

    return year;
  }

  async build(): Promise<AnimeBasic[]> {
    return this.animeClient.list(this.params);
  }
}
