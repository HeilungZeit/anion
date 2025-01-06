import { Pipe, PipeTransform } from '@angular/core';

import { AnimeEpisodesI } from '../interfaces/anime.types';

@Pipe({
  name: 'episodeDeclension',
  standalone: true,
})
export class EpisodeDeclensionPipe implements PipeTransform {
  transform(value: AnimeEpisodesI): string {
    if (!value.count) return 'эпизодов';

    const cases = [2, 0, 1, 1, 1, 2];
    const titles = ['эпизод', 'эпизода', 'эпизодов'];

    return titles[
      value.count % 100 > 4 && value.count % 100 < 20
        ? 2
        : cases[Math.min(value.count % 10, 5)]
    ];
  }
}
