import {
  patchState,
  Prettify,
  StateSignals,
  WritableStateSource,
} from '@ngrx/signals';

import { AnimeState } from './animes.store';
import { YumiService } from '../services/yumi/yumi.service';
import { AnimeQueryI } from '../interfaces/queries.types';
import { AnimeDetailsI } from '../interfaces/anime.types';

export const createAnimeMethods = (
  store: Prettify<
    StateSignals<AnimeState> & WritableStateSource<Prettify<AnimeState>>
  >,
  yumiService: YumiService
) => {
  return {
    async getFeed(): Promise<void> {
      patchState(store, { isLoading: true });

      try {
        const feedData = await yumiService.getFeed();

        patchState(store, {
          feed: feedData,
          isLoading: false,
        });
      } catch (error) {
        console.error(error);
        patchState(store, { isLoading: false });
      }
    },

    async getRecommendations(id: number): Promise<void> {
      patchState(store, { isRecommendationsLoading: true });
      try {
        const recommendations = await yumiService.getRecommendations(id);
        patchState(store, {
          recommendations,
          isRecommendationsLoading: false,
        });
      } catch (error) {
        console.error(error);
        patchState(store, { isRecommendationsLoading: false });
      }
    },

    async getCatalog(
      query: AnimeQueryI,
      replaceList: boolean = false,
      useReceivedQuery: boolean = false
    ): Promise<void> {
      patchState(store, {
        catalog: { ...store.catalog(), isCatalogLoading: true },
      });

      this.setCatalogQueryParams(query, useReceivedQuery);

      try {
        const list: AnimeDetailsI[] = await yumiService.getAnimeWithQuery(
          useReceivedQuery ? query : store.catalog().query
        );

        if (list.length < 20) {
          patchState(store, {
            catalog: { ...store.catalog(), haveMore: false },
          });
        }

        patchState(store, {
          catalog: {
            ...store.catalog(),
            anime: replaceList ? list : [...store.catalog().anime, ...list],
            isCatalogLoading: false,
          },
        });
      } catch (error) {
        console.error(error);
        patchState(store, {
          catalog: { ...store.catalog(), isCatalogLoading: false },
        });
      }
    },

    async getGenres(): Promise<void> {
      patchState(store, {
        genres: { ...store.genres(), isGenresLoading: true },
      });

      try {
        const genres = await yumiService.getGenres();

        patchState(store, {
          genres: { ...genres, isGenresLoading: false },
        });
      } catch (e) {
        console.error(e);
        patchState(store, {
          genres: { ...store.genres(), isGenresLoading: false },
        });
      }
    },

    setCatalogQueryParams(
      query: AnimeQueryI,
      useReceivedQuery: boolean = false
    ): void {
      patchState(store, {
        catalog: {
          ...store.catalog(),
          query: useReceivedQuery
            ? query
            : { ...store.catalog().query, ...query },
        },
      });
    },
  };
};
