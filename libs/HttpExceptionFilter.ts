import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter
  implements ExceptionFilter<HttpException | Error>
{
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(
    exception: HttpException | Error,
    host: ArgumentsHost,
  ): Response<string, Record<string, string>> {
    this.logger.error(exception.message, exception.stack);
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      this.logger.error(
        {
          request: {
            method: request.method,
            url: request.url,
            body: request.body,
          },
        },
        exception.stack,
      );
      if (exception.getStatus() === HttpStatus.INTERNAL_SERVER_ERROR)
        return response.status(500).json();
      if (
        exception.getStatus() === 404 &&
        exception.message.split(' ')[0] === 'Cannot' &&
        exception.message.split(' ').length === 3
      )
        return response.status(404).json();
      return response
        .status(exception.getStatus())
        .json(exception.getResponse());
    }

    this.logger.error(
      {
        request: {
          method: request.method,
          url: request.url,
          body: request.body,
        },
      },
      exception.stack,
    );
    return response.status(500).json();
  }
}
