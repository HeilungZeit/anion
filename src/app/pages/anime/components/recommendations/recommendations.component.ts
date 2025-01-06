import { Component, inject, OnInit } from '@angular/core';
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
export class RecommendationsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly store = inject(AnimesStore);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    if (!this.store.recommendations().length) {
      const id = this.route.params.pipe(map((params) => params['id']));

      id.pipe(takeUntil(this.destroy$)).subscribe((id) => {
        this.store.getRecommendations(+id);
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
