import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { AnimeTileComponent } from '../anime-tile/anime-tile.component';
import { TilesSkeletonComponent } from '../../../layouts/tiles-skeleton/tiles-skeleton.component';
import { AnimeDetailsI } from '../../../interfaces/anime.types';

@Component({
  selector: 'ani-list',
  imports: [AnimeTileComponent, TilesSkeletonComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimeList {
  animes = input<AnimeDetailsI[]>([]);
  isLoading = input<boolean>(true);

  getArrayWithLength = computed(() => new Array(30).fill(0));
}
