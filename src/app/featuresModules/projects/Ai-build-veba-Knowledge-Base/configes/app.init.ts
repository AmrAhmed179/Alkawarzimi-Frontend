import { APP_INITIALIZER } from '@angular/core';
import { ConfigService } from './config.service';


export function initializeApp(configService: ConfigService) {
  return () => configService.loadConfig();
}

export const AppInitializer = {
  provide: APP_INITIALIZER,
  useFactory: initializeApp,
  deps: [ConfigService],
  multi: true
};
