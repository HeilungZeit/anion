import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { AnimesStore } from '../../store/animes.store';
import { ContentLayout } from '../../layouts/content/content.component';
import { CatalogTileComponent } from '../../components/custom/catalog-page/catalog-tile/catalog-tile.component';
import { DEFAULT_QUERY } from '../../constants';
import { FilterPanelComponent } from '../../components/custom/catalog-page/filter-panel/filter-panel.component';
import { VideoLoaderComponent } from '../../components/ui/video-loader/video-loader.component';
import { InfiniteScrollService } from '../../services/infinite-scroll.service';

@Component({
  selector: 'app-catalog',
  imports: [
    ContentLayout,
    CatalogTileComponent,
    FilterPanelComponent,
    VideoLoaderComponent,
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogComponent implements OnInit, AfterViewChecked {
  protected lastAnimeElement: HTMLElement | null = null;

  readonly store = inject(AnimesStore);
  readonly infiniteScrollService = inject(InfiniteScrollService);
  readonly document = inject(DOCUMENT);

  ngOnInit(): void {
    this.store.getCatalog(DEFAULT_QUERY);
  }

  ngAfterViewChecked(): void {
    const newLastElement = this.document?.getElementById('lastItem');
    // Если новый элемент существует
    if (newLastElement) {
      // Если последний элемент отличается от текущего или его нет в DOM
      if (!this.lastAnimeElement || this.lastAnimeElement !== newLastElement) {
        this.lastAnimeElement = newLastElement;
        this.setupInfiniteScroll();
      }
    } else {
      // Если новый элемент не найден, сбрасываем текущий
      this.lastAnimeElement = null;
    }
  }

  private setupInfiniteScroll(): void {
    if (this.lastAnimeElement) {
      this.infiniteScrollService.setupInfiniteScroll(
        this.lastAnimeElement,
        () => this.loadMoreAnime()
      );
    }
  }

  private loadMoreAnime(): void {
    this.infiniteScrollService.disconnect();

    if (this.store.catalog().haveMore) {
      this.store.getCatalog({
        offset: this.store.catalog().query.offset + 20,
      });
    }

    setTimeout(() => {
      const newLastElement = this.document?.getElementById('lastItem');
      if (newLastElement) {
        this.lastAnimeElement = newLastElement;
        this.setupInfiniteScroll();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    this.infiniteScrollService.disconnect();
  }
}
