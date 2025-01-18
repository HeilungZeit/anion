import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';

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
export class CatalogComponent implements OnInit, OnDestroy {
  protected lastAnimeElement = signal<HTMLElement | null>(null);

  readonly store = inject(AnimesStore);
  readonly infiniteScrollService = inject(InfiniteScrollService);

  constructor() {
    effect(() => {
      if (this.lastAnimeElement()) {
        this.setupInfiniteScroll();
      }
    });
  }

  ngOnInit(): void {
    this.store.getCatalog(DEFAULT_QUERY);
  }

  private setupInfiniteScroll(): void {
    if (this.lastAnimeElement()) {
      this.infiniteScrollService.setupInfiniteScroll(
        this.lastAnimeElement() as Element,
        async () => await this.loadMoreAnime()
      );
    }
  }

  protected async loadMoreAnime(): Promise<void> {
    if (
      this.store.catalog().haveMore &&
      !this.store.catalog().isCatalogLoading
    ) {
      await this.store.getCatalog({
        offset: this.store.catalog().query.offset + 20,
      });
    }

    this.infiniteScrollService.disconnect();
  }

  ngOnDestroy(): void {
    this.infiniteScrollService.disconnect();
  }
}
