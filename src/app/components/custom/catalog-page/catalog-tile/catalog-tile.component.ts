import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe, DOCUMENT } from '@angular/common';
import { TuiFormatNumberPipe, TuiHint, TuiIcon } from '@taiga-ui/core';

import { AnimeDetailsI } from '../../../../interfaces/anime.types';
import { TruncatePipe } from '../../../../pipes/truncate.pipe';
import { LastItemDirective } from '../../../../directives/last-item.directive';
import { LAST_ITEM_TOKEN } from '../../../../tokens/last-item.token';

@Component({
  selector: 'ani-catalog-tile',
  imports: [
    RouterLink,
    TuiIcon,
    TuiFormatNumberPipe,
    AsyncPipe,
    TuiHint,
    TruncatePipe,
    LastItemDirective,
  ],
  templateUrl: './catalog-tile.component.html',
  styleUrl: './catalog-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogTileComponent implements OnInit {
  anime = input.required<AnimeDetailsI>();
  lastAnimeElement = input.required<WritableSignal<HTMLElement | null>>();
  isLast = input<boolean>();

  readonly document = inject(DOCUMENT);

  lastItemId = viewChild<ElementRef>(LAST_ITEM_TOKEN);

  constructor() {
    effect(() => {
      if (this.isLast()) {
        this.lastAnimeElement().set(this.lastItemId()?.nativeElement);
      }
    });
  }

  ngOnInit(): void {
    if (this.isLast()) {
      this.lastAnimeElement().set(this.lastItemId()?.nativeElement);
    }
  }

  get genres(): string {
    return this.anime()
      .genres.map((genre) => genre.title)
      .join(', ');
  }
}
