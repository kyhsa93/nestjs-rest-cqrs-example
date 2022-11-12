import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

import { RequestStorage } from 'libs/RequestStorage';

export class RequestStorageMiddleware implements NestMiddleware {
  use(
    request: Request,
    response: Response,
    next: (error?: object) => void,
  ): void {
    RequestStorage.reset();
    next();
  }
}
