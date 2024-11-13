import { Component, input } from '@angular/core';
import { AnimeTileComponent } from '../anime-tile/anime-tile.component';

@Component({
  selector: 'ani-list',
  standalone: true,
  imports: [AnimeTileComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class AnimeList {
  animes = input<any>({});

  get items() {
    return this.animes().items as any[];
  }
}
