import { provideAnimations } from '@angular/platform-browser/animations';
import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  withRouterConfig,
} from '@angular/router';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';

import { routes } from '../routes/app.routes';
import { AnimesStore } from '../store/animes.store';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { API_BASE_URL } from '../services/axios/axios.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
      withRouterConfig({ urlUpdateStrategy: 'eager' })
    ),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(),
    NG_EVENT_PLUGINS,
    AnimesStore,
    provideHttpClient(
      withInterceptorsFromDi() // Подключаем интерсепторы из DI
    ),
    { provide: API_BASE_URL, useValue: 'http://localhost:3001' }, // доставать из env файла
  ],
};
