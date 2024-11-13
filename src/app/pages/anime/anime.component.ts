import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  Signal,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { v4 } from 'uuid';

import { ContentLayout } from '../../layouts/content/content.component';
import { YearPipe } from '../../pipes/year.pipe';
import { InfoItemComponent } from '../../components/info-item/info-item.component';
import { TabsComponent } from '../../components/tabs/tabs.component';
import { DescrComponent } from '../../components/descr/descr.component';
import { AnimePlayerComponent } from '../../components/anime-player/anime-player.component';
import { RemoveCharactersPipe } from '../../pipes/removeChars.pipe';
import { ChipComponent } from '../../components/chip/chip.component';
import { CommentInputComponent } from '../../components/comment-input/comment-input.component';
import { ImageSliderComponent } from '../../components/image-slider/image-slider.component';
import { InfoItemI } from './interfaces/types';
import { take } from 'rxjs';

// Добавляем интерфейс для данных аниме
interface AnimeDetails {
  episodes: { aired: number };
  animeStatus: { title: string };
  minAge: { titleLong: string };
  rating: { average: number };
  randomScreenshots: Array<{ sizes: { full: string } }>;
  videos: any[];
  fandubbers: any[];
  genres: any[];
  otherTitles: any[];
  description: string;
  year: number;
  title: string;
  poster: { fullsize: string };
}

@Component({
  selector: 'app-anime',
  standalone: true,
  imports: [
    ContentLayout,
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    CommonModule,
    YearPipe,
    InfoItemComponent,
    TabsComponent,
    DescrComponent,
    AnimePlayerComponent,
    RemoveCharactersPipe,
    ChipComponent,
    CommentInputComponent,
    ImageSliderComponent,
  ],
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush, // Добавляем OnPush стратегию
})
export class AnimeComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);

  readonly animeDetails = signal<AnimeDetails>({} as AnimeDetails);
  readonly tabIndex = signal(0);
  tabs = ['Описание', 'Плеер'];

  readonly tabsComponentRef: Signal<TabsComponent> =
    viewChild.required(TabsComponent);

  constructor() {
    effect(
      () => {
        const unsubscribe = this.tabsComponentRef().onTabChange.subscribe(
          (index: number) => {
            this.tabIndex.set(index);
          }
        );

        return () => unsubscribe.unsubscribe();
      },
      { allowSignalWrites: true }
    );
  }

  // Мемоизируем функцию с помощью computed
  readonly getSafeUrl = computed(() => {
    return (url: string): SafeResourceUrl =>
      this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  readonly infoItems = computed<InfoItemI[]>(() => {
    const details = this.animeDetails();
    if (!details) return [];

    return [
      {
        id: v4(),
        value: details.episodes?.aired ?? 0,
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

  readonly screenshots = computed(() => {
    const details = this.animeDetails();
    if (!details?.randomScreenshots) return [];

    return details.randomScreenshots.map((item) => ({
      id: v4(),
      original: item.sizes.full,
    }));
  });

  ngOnInit(): void {
    // Используем take(1) чтобы автоматически отписаться после первого значения
    this.route.data.pipe(take(1)).subscribe(({ animeInfo }) => {
      if (animeInfo?.['animeDetails']) {
        this.animeDetails.set(animeInfo['animeDetails']);
      }
    });
  }
}