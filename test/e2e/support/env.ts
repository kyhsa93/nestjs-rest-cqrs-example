/**
 * `src/config.ts` reads process.env when it is first imported and exits the process
 * when a value is invalid, so these defaults must be in place before the app is imported.
 * They match docker-compose.yml (MySQL and LocalStack published on localhost); any value
 * can be overridden from the environment.
 */
process.env.AWS_REGION ??= 'ap-northeast-2';
process.env.AWS_ENDPOINT ??= 'http://localhost:4566';
process.env.AWS_ACCESS_KEY_ID ??= 'test';
process.env.AWS_SECRET_ACCESS_KEY ??= 'test';
process.env.AWS_SQS_QUEUE_URL ??= 'http://localhost:4566/000000000000/example';
process.env.SQS_DOMAIN_EVENT_QUEUE_URL ??=
  'http://localhost:4566/000000000000/domain-events';
process.env.DATABASE_LOGGING ??= 'false';
process.env.DATABASE_HOST ??= 'localhost';
process.env.DATABASE_PORT ??= '3306';
process.env.DATABASE_NAME ??= 'nest';
process.env.DATABASE_SECRET_ID ??= 'nest/database';
process.env.DATABASE_SYNC ??= 'true';
process.env.EMAIL ??= 'no-reply@example.com';
process.env.PORT ??= '5000';
