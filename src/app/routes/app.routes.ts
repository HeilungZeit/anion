import { Routes } from '@angular/router';
import { AnimeResolver } from './resolvers/anime.resolver';

export const routes: Routes = [
  {
    path: '',
    title: 'Home - Anion',
    loadComponent: () =>
      import('../pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'catalog',
    title: 'Catalog  - Anion',
    loadComponent: () =>
      import('../pages/catalog/catalog.component').then(
        (m) => m.CatalogComponent
      ),
  },
  {
    path: 'search',
    title: 'Search  - Anion',
    loadComponent: () =>
      import('../pages/search/search.component').then((m) => m.SearchComponent),
  },
  {
    path: 'anime/:id',
    title: 'Anime  - Anion',
    loadComponent: () =>
      import('../pages/anime/anime.component').then((m) => m.AnimeComponent),
    resolve: {
      animeInfo: AnimeResolver,
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },
  {
    path: '**',
    loadComponent: () =>
      import('../pages/page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent
      ),
  },
];
