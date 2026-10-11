import './env';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import 'src/timezone';
import { AppModule } from 'src/app-module';
import { configureApp } from 'src/app-setup';

/**
 * Boots the real AppModule against MySQL and LocalStack with the same HTTP setup as main.ts.
 *
 * `writeConnection` and `readConnection` are module-level singletons, so a Jest worker can
 * hold one app at a time. The config runs with maxWorkers 1 and each spec file creates its
 * app in beforeAll and closes it in afterAll.
 */
export async function createTestApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleRef.createNestApplication();
  configureApp(app);
  await app.init();
  return app;
}
