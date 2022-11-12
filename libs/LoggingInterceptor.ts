import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';

import { RequestStorage } from 'libs/RequestStorage';

export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<object>,
  ): Observable<object> | Promise<Observable<object>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data) => {
        this.logger.log(
          JSON.stringify({
            requestId: RequestStorage.getStorage().requestId,
            userAgent: request.header('user-agent'),
            request: {
              method: request.method,
              url: request.url,
              body: request.body,
            },
            response: {
              ...data,
              statusCode: response.statusCode,
            },
          }),
        );
        return data;
      }),
    );
  }
}
