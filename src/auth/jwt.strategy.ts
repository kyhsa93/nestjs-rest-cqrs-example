import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import AppConfiguration from '../app.config';
import ReadAccountQuery from '../account/application/query/implements/account.query.by.id';
import Account from '../account/domain/model/account';

type PayloadType = { id: string; email: string; name: string };

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly queryBus: QueryBus) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AppConfiguration.jwt.secret,
    });
  }

  private async validate(payload: PayloadType): Promise<PayloadType | false> {
    const account: Account = await this.queryBus.execute(new ReadAccountQuery(payload.id));
    // return account && account.email === payload.email && account.name === payload.name
    //   ? payload
    //   : false;
    return false;
  }
}
