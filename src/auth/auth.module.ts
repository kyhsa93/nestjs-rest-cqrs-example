import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppConfiguration } from '../app.config';
import { JwtStrategy } from './jwt.strategy';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    JwtModule.register({ secret: AppConfiguration.JWT_SECRET, signOptions: { expiresIn: AppConfiguration.JWT_EXPIRATION } }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
