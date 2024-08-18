import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AnimesStore } from '../../store/animes.store';
import { Id } from 'node-shikimori';

@Injectable({
  providedIn: 'root',
})
export class AnimeResolver implements Resolve<any> {
  readonly store = inject(AnimesStore);

  async resolve(route: ActivatedRouteSnapshot): Promise<any> {
    const id = route.paramMap.get('id');

    const createId = (value: string | null): Id<number> => {
      return { id: Number(value) };
    };

    await this.store.getAnimeData(createId(id));

    return this.store.animeData();
  }
}
