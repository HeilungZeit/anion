import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Subject, takeUntil } from 'rxjs';

import { AnimeList } from '../../../../components/custom/list/list.component';
import { AnimesStore } from '../../../../store/animes.store';

@Component({
  selector: 'app-recommendations',
  imports: [AnimeList],
  templateUrl: './recommendations.component.html',
  styleUrl: './recommendations.component.scss',
})
export class RecommendationsComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  readonly store = inject(AnimesStore);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params) => params['id']),
        takeUntil(this.destroy$)
      )
      .subscribe((id) => {
        if (
          !this.store.recommendations().list.length ||
          this.store.recommendations().recommendationsFor !== id.toString()
        ) {
          this.store.getRecommendations(+id);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
