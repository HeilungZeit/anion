import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server,
  },
  {
    path: 'catalog',
    renderMode: RenderMode.Server,
  },
  {
    path: 'series',
    renderMode: RenderMode.Server,
  },
  {
    path: 'anime/:id',
    renderMode: RenderMode.Server,
  },
  { path: '**', renderMode: RenderMode.Client },
  //   {
  //     path: 'top',
  //     title: 'Top 100',
  //     component: TopComponent,
  //   },
];
