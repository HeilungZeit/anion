import { provideServerRendering, withRoutes } from '@angular/ssr';
import {
  mergeApplicationConfig,
  ApplicationConfig,
  PLATFORM_ID,
} from '@angular/core';

import { appConfig } from './app.config';
import { serverRoutes } from '../routes/app.routes.server';
import { UNIVERSAL_PROVIDERS } from '@ng-web-apis/universal';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(withRoutes(serverRoutes)), UNIVERSAL_PROVIDERS, {
      provide: PLATFORM_ID,
      useValue: 'server',
    }],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
