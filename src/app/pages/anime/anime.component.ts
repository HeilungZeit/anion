import {
  Component,
  effect,
  inject,
  OnInit,
  Signal,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { v4 } from 'uuid';

import { ContentLayout } from '../../layouts/content/content.component';
import { AnimesStore } from '../../store/animes.store';
import { YearPipe } from '../../pipes/year.pipe';
import { InfoItemComponent } from '../../components/info-item/info-item.component';
import { InfoItemI } from './interfaces/types';
import { StatusService } from '../../services/helpers/get-status.service';
import { TabsComponent } from '../../components/tabs/tabs.component';
import { DescrComponent } from '../../components/descr/descr.component';

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
  ],
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.scss',
})
export class AnimeComponent implements OnInit {
  private readonly store = inject(AnimesStore);
  private readonly route = inject(ActivatedRoute);
  readonly anime = signal(this.store.animeData());
  tabIndex = signal(0);

  tabsComponentRef: Signal<TabsComponent> = viewChild.required(TabsComponent);

  constructor(private statusService: StatusService) {
    effect(() => {
      this.tabsComponentRef().onTabChange.subscribe((event: number) => {
        this.tabIndex.set(event);
      });
    });
  }

  readonly statuses = {
    anons: 'Анонс',
    ongoing: 'Онгоинг',
    released: 'Вышло',
  };

  readonly ratings = {
    none: '0+',
    g: '0+',
    pg: '6+',
    pg_13: '13+',
    r: '17+',
    r_plus: '17+',
    rx: '18+',
  };

  readonly tabs: string[] = ['Описание', 'Плеер'];

  get infoItems(): InfoItemI[] {
    return [
      { id: v4(), value: this.anime().episodes_aired, title: 'Эпизодов' },
      {
        id: v4(),
        value: this.statusService.getStatus(this.anime().status),
        title: 'Статус',
      },
      { id: v4(), value: this.ratings[this.anime().rating], title: 'PG' },
      {
        id: v4(),
        value: this.anime().score,
        title: 'Оценка',
        icon: 'tuiIconStar',
      },
    ];
  }

  showTabIndex(index: any) {
    console.log(index);
  }

  async ngOnInit() {
    this.route.data.subscribe((data) => {
      this.anime.set(data['anime']);
    });
  }
}
