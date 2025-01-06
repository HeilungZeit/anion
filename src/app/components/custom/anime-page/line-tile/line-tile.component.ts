import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BasicAnimeI } from '../../../../interfaces/anime.types';

@Component({
  selector: 'ani-line-tile',
  imports: [RouterLink],
  templateUrl: './line-tile.component.html',
  styleUrl: './line-tile.component.scss',
})
export class LineTileComponent {
  anime = input.required<BasicAnimeI>();
}
