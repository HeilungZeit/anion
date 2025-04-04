import { signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';

import {
  AnimeDetailsI,
  GenreGroup,
  GenreResponse,
} from '../interfaces/anime.types';
import { createAnimeMethods } from './animes.methods';
import { YumiService } from '../services/yumi/yumi.service';
import { AnimeQueryI } from '../interfaces/queries.types';
import { DEFAULT_QUERY } from '../constants';

export type AnimeState = {
  feed: {
    seasonAnime: AnimeDetailsI[];
    schedule: any;
    updates: any;
  };
  catalog: {
    anime: AnimeDetailsI[];
    query: AnimeQueryI;
    isCatalogLoading: boolean;
    haveMore: boolean;
  };
  genres: {
    genres: GenreResponse<number>[];
    groups: GenreGroup[];
    isGenresLoading: boolean;
  };
  search: {
    searchResults: AnimeDetailsI[];
    isSearchLoading: boolean;
  };
  isLoading: boolean;
  recommendations: AnimeDetailsI[];
  isRecommendationsLoading: boolean;
};

const initialState: AnimeState = {
  feed: {
    seasonAnime: [],
    schedule: [],
    updates: [],
  },
  genres: { genres: [], groups: [], isGenresLoading: false },
  recommendations: [],
  catalog: {
    anime: [] as AnimeDetailsI[],
    query: DEFAULT_QUERY,
    haveMore: true,
    isCatalogLoading: false,
  },
  search: {
    searchResults: [],
    isSearchLoading: false,
  },
  isLoading: false,
  isRecommendationsLoading: false,
};

export const AnimesStore = signalStore(
  { protectedState: false },
  withState<AnimeState>(initialState),
  withMethods((store, yumiService = inject(YumiService)) =>
    createAnimeMethods(store, yumiService)
  )
  // withHooks({
  // onInit(store) {
  // effect(() => {
  //   console.log(store.catalog().anime);
  // });
  // },
  // })
);
