import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { YumiService } from '../services/yumi/yumi.service';

type AnimeState = {
  feed: any;
  isLoading: boolean;
  error: Error | void;
};

const initialState: AnimeState = {
  feed: {},
  isLoading: false,
  error: void 0,
};

export const AnimesStore = signalStore(
  withState(initialState),
  withMethods((store, yumiService = inject(YumiService)) => ({
    async getFeed(): Promise<void> {
      patchState(store, { isLoading: true });

      const feedData = await yumiService.getFeed();

      patchState(store, {
        feed: feedData,
        isLoading: false,
      });
    },
    // async getAnimeData(id: Id<number>): Promise<void> {
    //   const animeData = await shikimoriService.getAnimeById(id);

    //   const { image, screenshots } = addBaseUrlToAnimeData(animeData);

    //   patchState(store, {
    //     animeData: {
    //       ...animeData,
    //       image,
    //       screenshots,
    //     },
    //   });
    // },
    // removeAnimeData(): void {
    //   patchState(store, { animeData: {} as Anime });
    // },
  }))
);
