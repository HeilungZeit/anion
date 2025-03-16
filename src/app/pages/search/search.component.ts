import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiTextfield } from '@taiga-ui/core';
import { TuiDataListWrapper } from '@taiga-ui/kit';
import { TuiSearch } from '@taiga-ui/layout';

import { ContentLayout } from '../../layouts/content/content.component';
import { CatalogTileComponent } from '../../components/custom/catalog-page/catalog-tile/catalog-tile.component';
import { AnimesStore } from '../../store/animes.store';
import { debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'ani-search',
  imports: [
    ContentLayout,
    CatalogTileComponent,
    ReactiveFormsModule,
    TuiDataListWrapper,
    TuiSearch,
    TuiTextfield,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  private subscriptions = new Subscription();

  lastAnimeElement = signal(null);
  store = inject(AnimesStore);

  protected readonly searchForm = new FormGroup({
    search: new FormControl(''),
  });

  constructor() {
    this.subscriptions.add(
      this.searchForm
        .get('search')
        ?.valueChanges.pipe(debounceTime(500))
        .subscribe((value: any) => {
          if (value) {
            this.store.searchAnime({
              search: value,
              offset: 0,
              limit: 10,
            });
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
