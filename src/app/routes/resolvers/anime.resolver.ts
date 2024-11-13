import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AnimesStore } from '../../store/animes.store';
import { YumiService } from '../../services/yumi/yumi.service';

@Injectable({
  providedIn: 'root',
})
export class AnimeResolver implements Resolve<any> {
  readonly store = inject(AnimesStore);
  readonly yumiService = inject(YumiService);

  async resolve(route: ActivatedRouteSnapshot): Promise<any> {
    const id = route.paramMap.get('id');

    const animeDetails = await this.yumiService.getAnime(Number(id));

    return { animeDetails };
  }
}
