import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import AppConfiguration from '../app.config';
import JwtStrategy from './jwt.strategy';

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    JwtModule.register({
      secret: AppConfiguration.jwt.secret,
      signOptions: { expiresIn: AppConfiguration.jwt.secret },
    }),
  ],
  providers: [JwtStrategy],
})
export default class AuthModule {}
