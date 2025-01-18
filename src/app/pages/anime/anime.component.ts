import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { v4 } from 'uuid';

import { ContentLayout } from '../../layouts/content/content.component';
import { InfoItemComponent } from '../../components/custom/info-item/info-item.component';
import { TabsComponent } from '../../components/custom/tabs/tabs.component';
import { DescrComponent } from '../../components/custom/anime-page/descr/descr.component';
import { AnimePlayerComponent } from '../../components/custom/anime-page/anime-player/anime-player.component';
import { RemoveCharactersPipe } from '../../pipes/removeChars.pipe';
import { ChipComponent } from '../../components/custom/chip/chip.component';
import { RecommendationsComponent } from './components/recommendations/recommendations.component';

import { AnimeDetailsI, InfoItemI } from '../../interfaces/anime.types';
import { Subject, takeUntil } from 'rxjs';
import { TuiElasticContainer, TuiTooltip } from '@taiga-ui/kit';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { LineTileComponent } from '../../components/custom/anime-page/line-tile/line-tile.component';

@Component({
  selector: 'app-anime',
  imports: [
    ContentLayout,
    NgOptimizedImage,
    CommonModule,
    InfoItemComponent,
    TabsComponent,
    DescrComponent,
    AnimePlayerComponent,
    RemoveCharactersPipe,
    ChipComponent,
    RecommendationsComponent,
    LineTileComponent,
    TuiTooltip,
    TuiIcon,
    TuiElasticContainer,
    TuiButton,
  ],
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimeComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private titleService = inject(Title);
  private readonly destroy$ = new Subject<void>();

  readonly tabs = ['Описание', 'Похожие аниме'];

  readonly animeDetails = signal<AnimeDetailsI>({} as AnimeDetailsI);
  readonly tabIndex = signal(0);

  pageId = signal(0);
  isExpanded = signal(false);

  constructor() {
    effect(() => {
      if (this.animeDetails()) {
        this.titleService.setTitle(`${this.animeDetails().title} - Anion`);
      }
    });
  }

  ngOnInit(): void {
    this.route.data
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ animeInfo }) => {
        if (animeInfo?.['animeDetails']) {
          this.animeDetails.set(animeInfo['animeDetails']);
          this.tabIndex.set(0);
          this.isExpanded.set(false);
        }
      });

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.pageId.set(params['id']);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggelExpand() {
    this.isExpanded.update((prev) => !prev);
  }

  readonly infoItems = computed<InfoItemI[]>(() => {
    const details = this.animeDetails();
    if (!details) return [];

    return [
      {
        id: v4(),
        value: `${details.episodes?.aired ?? 0} из ${
          details.episodes?.count || 'TBD'
        }`,
        title: 'Эпизодов',
        icon: '',
      },
      {
        id: v4(),
        value: details.animeStatus?.title ?? 'Неизвестно',
        title: 'Статус',
        icon: '',
      },
      {
        id: v4(),
        value: details.minAge?.titleLong ?? 'Не указано',
        title: 'PG',
        icon: '',
      },
      {
        id: v4(),
        value: details.rating?.average?.toFixed(1) ?? '0.0',
        title: 'Оценка',
        icon: '@tui.star',
      },
    ];
  });

  readonly getTimeDiffereceToNextEpisode = computed<{
    date: string;
    timeLeft: string;
  } | null>(() => {
    const details = this.animeDetails();
    const nextDate = details?.episodes?.nextDate;

    if (!nextDate) return null;

    const date = new Date(nextDate * 1000);
    const formattedDate = date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });

    const now = Date.now();
    const nextEpisodeDate = nextDate * 1000;
    const diff = nextEpisodeDate - now;

    if (diff <= 0) {
      return {
        date: formattedDate,
        timeLeft: 'Уже вышло',
      };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    let timeLeft = 'Через ';
    if (days > 0) timeLeft += `${days} дн. `;
    if (hours > 0) timeLeft += `${hours} ч. `;
    timeLeft += `${minutes} мин.`;

    return {
      date: formattedDate,
      timeLeft,
    };
  });
}
