import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

export type ErrorExceptionMapping = [
  string,
  new (response: string | object) => HttpException,
  string,
];

export function generateErrorResponse(
  message: string,
  mappings: ErrorExceptionMapping[],
): HttpException {
  const matched = mappings.find(([msg]) => msg === message);
  const [, ExceptionClass, code] = matched ?? [
    null,
    InternalServerErrorException,
    'INTERNAL_ERROR',
  ];
  const probe = new ExceptionClass(message);
  const statusCode = probe.getStatus();
  const error = HttpStatus[statusCode] ?? probe.name;
  return new ExceptionClass({ statusCode, code, message, error });
}
