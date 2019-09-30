import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AppConfiguration } from '../app.config';
import { ReadAccountQuery } from '../account/application/query/implements/account.query';
import { ReadAccountDTO } from '../account/interface/dto/account.dto.read';
import { QueryBus } from '@nestjs/cqrs';
import { Account } from '../account/domain/model/account.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly queryBus: QueryBus,
) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AppConfiguration.JWT_SECRET,
    });
  }

  private async validate(payload: { accountId: string, email: string, name: string }): Promise<{ accountId: string, email: string, name: string } | false> {
    const dto: ReadAccountDTO = new ReadAccountDTO(payload.accountId);
    const account: Account = await this.queryBus.execute(new ReadAccountQuery(dto));
    return (account) && (account.email === payload.email) && (account.name === payload.name) ? payload : false;
  }
}
