import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { AnimeTileComponent } from '../anime-tile/anime-tile.component';
import { TilesSkeletonComponent } from '../../../layouts/tiles-skeleton/tiles-skeleton.component';

@Component({
  selector: 'ani-list',
  imports: [AnimeTileComponent, TilesSkeletonComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimeList {
  animes = input<any[]>([]);

  getArrayWithLength = computed(() => new Array(20).fill(0));
}
