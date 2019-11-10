import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import AppConfiguration from '../app.config';
import { ReadAccountQuery } from '../account/application/query/implements/account.query';
import ReadAccountDTO from '../account/interface/dto/account.dto.read';
import Account from '../account/domain/model/account.model';

type PayloadType = { id: string; email: string; name: string };

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly queryBus: QueryBus,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AppConfiguration.JWT_SECRET,
    });
  }

  private async validate(payload: PayloadType): Promise<PayloadType | false> {
    const dto = new ReadAccountDTO(payload.id);
    const account: Account = await this.queryBus.execute(new ReadAccountQuery(dto));
    return (account) && (account.email === payload.email) && (account.name === payload.name)
      ? payload : false;
  }
}
