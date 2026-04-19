import { HttpException, InternalServerErrorException } from '@nestjs/common';

export type ErrorExceptionMapping = [
  string,
  new (message: string) => HttpException,
];

export function generateErrorResponse(
  message: string,
  mappings: ErrorExceptionMapping[],
): HttpException {
  const matched = mappings.find(([msg]) => msg === message);
  const ExceptionClass = matched ? matched[1] : InternalServerErrorException;
  return new ExceptionClass(message);
}
