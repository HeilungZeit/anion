import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { YumiService } from '../services/yumi/yumi.service';

type AnimeState = {
  feed: any;
  isLoading: boolean;
};

const initialState: AnimeState = {
  feed: {},
  isLoading: false,
};

export const AnimesStore = signalStore(
  { protectedState: false }, withState(initialState),
  withMethods((store, yumiService = inject(YumiService)) => ({
    async getFeed(): Promise<void> {
      patchState(store, { isLoading: true });

      let feedData: any;

      try {
        feedData = await yumiService.getFeed();
      } catch (error) {
        console.error(error);
      } finally {
        patchState(store, { isLoading: false });
      }

      patchState(store, {
        feed: feedData,
        isLoading: false,
      });
    },
  }))
);
