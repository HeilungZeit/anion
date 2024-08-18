import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Anime, AnimeBasic, Id } from 'node-shikimori';
import { ShikimoriService } from '../services/shikimori/shikimori.service';
import { addBaseUrlToAnimeData, buildImgUrl } from '../helpers/buildImgUrl';

type AnimeState = {
  animes: AnimeBasic[];
  movies: AnimeBasic[];
  animeData: Anime;
  isLoadingSeries: boolean;
  isLoadingMovies: boolean;
  error: Error | void;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: AnimeState = {
  animes: [],
  movies: [],
  animeData: {} as Anime,
  isLoadingSeries: false,
  isLoadingMovies: false,
  error: void 0,
  filter: { query: '', order: 'asc' },
};

export const AnimesStore = signalStore(
  withState(initialState),
  withMethods((store, shikimoriService = inject(ShikimoriService)) => ({
    async getSeasonAnime(): Promise<void> {
      patchState(store, { isLoadingSeries: true });

      const animes = await shikimoriService.getAnimeForHomePage();

      const animesWithCorrectImages = buildImgUrl(animes);

      patchState(store, {
        animes: animesWithCorrectImages,
        isLoadingSeries: false,
      });
    },
    async getMovieAnime(): Promise<void> {
      patchState(store, { isLoadingMovies: true });

      const movies = await shikimoriService.getMovieAnime();

      const moviesWithCorrectImages = buildImgUrl(movies);

      patchState(store, {
        movies: moviesWithCorrectImages,
        isLoadingMovies: false,
      });
    },
    async getAnimeData(id: Id<number>): Promise<void> {
      const animeData = await shikimoriService.getAnimeById(id);

      const { image, screenshots } = addBaseUrlToAnimeData(animeData);

      patchState(store, {
        animeData: {
          ...animeData,
          image,
          screenshots,
        },
      });
    },
    removeAnimeData(): void {
      patchState(store, { animeData: {} as Anime });
    },
  }))
);
