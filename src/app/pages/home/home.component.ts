import { Component, inject, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ContentLayout } from '../../layouts/content/content.component';
import { AnimeList } from '../../components/custom/list/list.component';
import { AnimesStore } from '../../store/animes.store';

@Component({
  selector: 'ani-home',
  imports: [ContentLayout, AnimeList, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly store = inject(AnimesStore);
  @Input() skeletonVisible: boolean = true;

  readonly animes = 'animes' as 'animes';
  readonly movies = 'movies' as 'movies';
  readonly radius = 10;
  readonly lightMode = true;
  readonly skeletonItems = Array.from({ length: 20 }).map((_, index) => ({
    id: index,
  }));

  ngOnInit() {
    this.store.getFeed();
  }
}
