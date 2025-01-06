import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  CommonModule,
  NgOptimizedImage,
  PRECONNECT_CHECK_BLOCKLIST,
} from '@angular/common';
import { TuiIcon } from '@taiga-ui/core';

import { TruncatePipe } from '../../../pipes/truncate.pipe';
import { ToFixedValuePipe } from '../../../pipes/toFixedValue.pipe';
import { EpisodeDeclensionPipe } from '../../../pipes/episode-declension.pipe';
import { AnimeDetailsI } from '../../../interfaces/anime.types';

@Component({
  selector: 'ani-tile',
  imports: [
    TuiIcon,
    NgOptimizedImage,
    TruncatePipe,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    ToFixedValuePipe,
    EpisodeDeclensionPipe,
  ],
  providers: [
    {
      provide: PRECONNECT_CHECK_BLOCKLIST,
      useValue: 'https://img.yani.tv',
    },
  ],
  templateUrl: './anime-tile.component.html',
  styleUrl: './anime-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimeTileComponent {
  anime = input.required<AnimeDetailsI>();
}
