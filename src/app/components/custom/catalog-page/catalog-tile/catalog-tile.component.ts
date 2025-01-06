import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { TuiFormatNumberPipe, TuiHint, TuiIcon } from '@taiga-ui/core';

import { AnimeDetailsI } from '../../../../interfaces/anime.types';

@Component({
  selector: 'ani-catalog-tile',
  imports: [RouterLink, TuiIcon, TuiFormatNumberPipe, AsyncPipe, TuiHint],
  templateUrl: './catalog-tile.component.html',
  styleUrl: './catalog-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogTileComponent {
  anime = input.required<AnimeDetailsI>();
}
