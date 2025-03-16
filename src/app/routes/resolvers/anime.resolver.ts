import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AnimesStore } from '../../store/animes.store';
import { YumiService } from '../../services/yumi/yumi.service';

@Injectable({
  providedIn: 'root',
})
export class AnimeResolver implements Resolve<any> {
  readonly store = inject(AnimesStore);
  readonly yumiService = inject(YumiService);
  readonly router = inject(Router);

  async resolve(
    route: ActivatedRouteSnapshot
  ): Promise<{ animeDetails: any } | never> {
    const id = route.paramMap.get('id');

    if (!id || isNaN(Number(id))) {
      console.warn(`[Resolver] Получен некорректный ID: ${id}`);
      this.router.navigate(['/']);
      return { animeDetails: null };
    }

    try {
      const animeDetails = await this.yumiService.getAnime(Number(id));

      if (!animeDetails) {
        throw new Error('Аниме не найдено');
      }

      return { animeDetails };
    } catch (e) {
      console.error(`[Resolver] Ошибка при получении аниме с ID ${id}:`, e);
      this.router.navigate(['/']);
      return { animeDetails: null };
    }
  }
}
