import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRoutesConfig } from '@angular/ssr';
import { provideServerRendering } from '@angular/platform-server';

import { appConfig } from './app.config';
import { serverRoutes } from '../routes/app.routes.server';
import { UNIVERSAL_PROVIDERS } from '@ng-web-apis/universal';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRoutesConfig(serverRoutes),
    UNIVERSAL_PROVIDERS,
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
