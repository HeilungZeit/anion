import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { CatalogComponent } from '../pages/catalog/catalog.component';
import { SeriesComponent } from '../pages/series/series.component';
import { AnimeComponent } from '../pages/anime/anime.component';
import { AnimeResolver } from './resolvers/anime.resolver';
import { PageNotFoundComponent } from '../pages/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Home - Anion',
    component: HomeComponent,
  },
  {
    path: 'catalog',
    title: 'Catalog  - Anion',
    component: CatalogComponent,
  },
  {
    path: 'series',
    title: 'Series  - Anion',
    component: SeriesComponent,
  },
  {
    path: 'anime/:id',
    title: 'Anime  - Anion',
    component: AnimeComponent,
    resolve: {
      animeInfo: AnimeResolver,
    },
  },
  { path: '**', component: PageNotFoundComponent },
  //   {
  //     path: 'top',
  //     title: 'Top 100',
  //     component: TopComponent,
  //   },
];
