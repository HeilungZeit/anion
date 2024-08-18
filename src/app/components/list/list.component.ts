import { Component, Input } from '@angular/core';
import { AnimeTileComponent } from '../anime-tile/anime-tile.component';
import { AnimeBasic } from 'node-shikimori';

@Component({
  selector: 'ani-list',
  standalone: true,
  imports: [AnimeTileComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class AnimeList {
  @Input() animes: AnimeBasic[] = [];
}
