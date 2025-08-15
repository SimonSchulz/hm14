import { INestApplication } from '@nestjs/common';

export const GLOBAL_PREFIX = '/hometask_14/api';

export function globalPrefixSetup(app: INestApplication): void {
  app.setGlobalPrefix(GLOBAL_PREFIX);
}
