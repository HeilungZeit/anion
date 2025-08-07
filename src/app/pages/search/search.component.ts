import {
  Component,
  inject,
  signal,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiTextfield } from '@taiga-ui/core';

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
    TuiTextfield,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnDestroy {
  private subscriptions = new Subscription();

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  lastAnimeElement = signal(null);
  store = inject(AnimesStore);

  protected readonly searchForm = new FormGroup({
    search: new FormControl<string>(''),
  });

  constructor() {
    this.subscriptions.add(
      this.searchForm
        .get('search')
        ?.valueChanges.pipe(debounceTime(500))
        .subscribe((value: string | null) => {
          if (value && value.trim()) {
            this.store.searchAnime({
              search: value.trim(),
              offset: 0,
              limit: 10,
            });
          } else {
            this.store.clearSearchResults();
          }
        })
    );
  }

  focusInput() {
    setTimeout(() => {
      this.searchInput?.nativeElement.focus();
    }, 0);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
