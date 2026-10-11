import { INestApplication, ValidationPipe } from '@nestjs/common';
import compression from 'compression';
import helmet from 'helmet';

import { HttpExceptionFilter } from 'libs/error/http-exception-filter';
import { LoggingInterceptor } from 'libs/logging/logging-interceptor';

/**
 * HTTP-level setup shared by the real bootstrap (`main.ts`) and the e2e tests,
 * so the tests exercise the same pipes, filters and middleware as production.
 */
export function configureApp(app: INestApplication): void {
  app.enableCors();
  app.use(helmet());
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
}
