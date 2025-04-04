import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiSearch } from '@taiga-ui/layout';
import { TuiButton, TuiDataList, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiButtonLoading, TuiDataListWrapper } from '@taiga-ui/kit';
import {
  TuiInputYearModule,
  TuiMultiSelectModule,
  TuiSelectModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';

import { AnimesStore } from '../../../../store/animes.store';
import { GenreResponse } from '../../../../interfaces/anime.types';
import { MultiSelectService } from '../../../../services/multi-select.service';
import {
  AnimeQueryI,
  GenericSelectItems,
  Sort,
  Status,
  Types,
} from '../../../../interfaces/queries.types';
import { yearRangeValidator } from './validators';

@Component({
  selector: 'ani-filter-panel',
  imports: [
    TuiSearch,
    TuiButton,
    TuiTextfield,
    TuiDataListWrapper,
    ReactiveFormsModule,
    TuiDataList,
    TuiMultiSelectModule,
    TuiTextfieldControllerModule,
    TuiSelectModule,
    TuiInputYearModule,
    TuiButtonLoading,
    TuiIcon,
  ],
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterPanelComponent implements OnInit {
  protected readonly store = inject(AnimesStore);

  readonly nextYear = new Date().getFullYear() + 1;

  private readonly types: GenericSelectItems<Types>[] = [
    { value: 'tv', title: 'Сериал' },
    { value: 'movie', title: 'Полнометражный фильм' },
    { value: 'ova', title: 'OVA' },
    { value: 'special', title: 'Спешл' },
    { value: 'shortfilm', title: 'Короткометражный фильм' },
    { value: 'shorttv', title: 'Малометражный сериал' },
    { value: 'ona', title: 'ONA' },
  ];

  private readonly status: GenericSelectItems<Status>[] = [
    { value: 'ongoing', title: 'Онгоинг' },
    { value: 'released', title: 'Вышел' },
    { value: 'announce', title: 'Анонс' },
  ];

  private readonly sort: GenericSelectItems<Sort>[] = [
    { value: 'top', title: 'Релевантности' },
    { value: 'title', title: 'Названию' },
    { value: 'year', title: 'Дате выхода' },
    { value: 'rating', title: 'Рейтингу' },
    { value: 'rating_counters', title: 'Голосам' },
    { value: 'views', title: 'Просмотрам' },
  ];

  private readonly genresService = new MultiSelectService<
    GenreResponse<number>
  >(() => this.store.genres().genres);
  private readonly typesService = new MultiSelectService<
    GenericSelectItems<Types>
  >(() => this.types);
  protected readonly statusService = new MultiSelectService<
    GenericSelectItems<Status>
  >(() => this.status);
  private readonly sortService = new MultiSelectService<
    GenericSelectItems<Sort>
  >(() => this.sort);

  protected readonly filterForm = new FormGroup(
    {
      search: new FormControl(),
      genres: new FormControl(),
      type: new FormControl(),
      status: new FormControl(),
      yearFrom: new FormControl(),
      yearTo: new FormControl(),
      sort: new FormControl(this.sort[0]),
    },
    { validators: yearRangeValidator() }
  );

  protected readonly genresToShow = this.genresService.itemsToShow;
  protected readonly stringifyGenresItems = this.genresService.stringifyItems;
  protected readonly stringifyGenres = this.genresService.stringify;
  protected readonly onSearchGenres = (text: string | null) =>
    this.genresService.onSearch(text);

  protected readonly typesToShow = this.typesService.itemsToShow;
  protected readonly stringifyTypesItems = this.typesService.stringifyItems;
  protected readonly stringifyTypes = this.typesService.stringify;
  protected readonly onSearchTypes = (text: string | null) =>
    this.typesService.onSearch(text);

  protected readonly statusToShow = this.statusService.itemsToShow;
  protected readonly stringifyStatusItems = this.statusService.stringifyItems;
  protected readonly stringifyStatus = this.statusService.stringify;
  protected readonly onSearchStatus = (text: string | null) =>
    this.statusService.onSearch(text);

  protected readonly sortToShow = this.sortService.itemsToShow;
  protected readonly stringifySortItems = this.sortService.stringifyItems;
  protected readonly stringifySort = this.sortService.stringify;

  ngOnInit(): void {
    this.store.getGenres();
  }

  protected readonly onSubmit = () => {
    this.filterForm.markAllAsTouched();

    if (this.filterForm.errors?.['yearRange']) {
      return;
    }

    const query: AnimeQueryI = {
      genres: (this.filterForm.value.genres || []).map(
        (genre: GenericSelectItems<number>) => genre.value
      ),
      types: (this.filterForm.value.type || []).map(
        (type: GenericSelectItems<Types>) => type.value
      ),
      status: (this.filterForm.value.status || []).map(
        (status: GenericSelectItems<Status>) => status.value
      ),
      fromYear: this.filterForm.value.yearFrom,
      toYear: this.filterForm.value.yearTo,
      sort: this.filterForm.value.sort?.value,
      sortForward: false,
      offset: 0,
      limit: 22,
    };

    this.store.getCatalog(query, true);
  };
}
