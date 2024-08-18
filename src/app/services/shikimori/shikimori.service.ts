import { Injectable } from '@angular/core';
import { Anime, AnimeBasic, client, Id } from 'node-shikimori';

import { AnimeBuilder } from './anime.service';
import { Seasons } from './interfaces/anime.interface';

@Injectable({
  providedIn: 'any',
})
export class ShikimoriService {
  private client = client();

  private currentYear = this.getCurrentYear();
  private currentSeason = this.getCurrentSeason();

  private getCurrentYear(): string {
    const currentYear = new Date().getFullYear();
    return currentYear.toString();
  }

  private getCurrentSeason(): Seasons {
    const month = new Date().getMonth();

    if (month >= 3 && month <= 5) {
      // Апрель, Май, Июнь
      return 'spring';
    } else if (month >= 6 && month <= 8) {
      // Июль, Август, Сентябрь
      return 'summer';
    } else if (month >= 9 && month <= 11) {
      // Октябрь, Ноябрь, Декабрь
      return 'fall';
    } else {
      // Январь, Февраль, Март
      return 'winter';
    }
  }

  async getAnimeForHomePage(): Promise<AnimeBasic[]> {
    const anime = new AnimeBuilder(this.client.animes);

    return anime
      .withOrder('popularity')
      .withSeason(this.currentYear, this.currentSeason)
      .withLimit(14)
      .build();
  }

  async getMovieAnime(): Promise<AnimeBasic[]> {
    const anime = new AnimeBuilder(this.client.animes);

    return anime
      .withKind('movie')
      .withOrder('popularity')
      .withSeason(this.currentYear)
      .withLimit(14)
      .build();
  }

  async getAnimeById(id: Id<number>): Promise<Anime> {
    return this.client.animes.byId(id);
  }
}
