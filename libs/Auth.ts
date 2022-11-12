import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { ApiBasicAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { Request } from 'express';

import {
  EntityIdTransformer,
  ENTITY_ID_TRANSFORMER,
  readConnection,
} from 'libs/DatabaseModule';
import { PasswordGenerator, PASSWORD_GENERATOR } from 'libs/PasswordModule';

import { AccountEntity } from 'src/account/infrastructure/entity/AccountEntity';

class AuthGuard implements CanActivate {
  @Inject(PASSWORD_GENERATOR)
  private readonly passwordGenerator: PasswordGenerator;
  @Inject(ENTITY_ID_TRANSFORMER)
  private readonly entityIdTransformer: EntityIdTransformer;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authorization = context
      .switchToHttp()
      .getRequest<Request>()
      .header('authorization');
    if (!authorization) return false;

    const [type, base64] = authorization.split(' ', 2);
    if ((type !== 'basic' && type !== 'Basic') || !base64) return false;

    const [accountId, password] = Buffer.from(base64, 'base64')
      .toString('utf8')
      .split(':', 2);
    if (!accountId || !password) return false;

    const account = await readConnection
      .getRepository(AccountEntity)
      .findOneBy({
        id: this.entityIdTransformer.to(accountId),
        password: this.passwordGenerator.generateKey(password),
      });
    if (!account) return false;

    context.switchToHttp().getRequest<Request>().headers.accountId = accountId;

    return true;
  }
}

export type AuthorizedHeader = Readonly<{ accountId: string }>;

export const Auth = () =>
  applyDecorators(
    UseGuards(AuthGuard),
    ApiBasicAuth(),
    ApiForbiddenResponse({
      description: 'Authorization header validation is failed',
    }),
  );
