// apps/api/src/modules/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

/**
 * Module d'authentification
 * 
 * Configure :
 * - PassportJS avec stratégie JWT
 * - JwtModule avec secret et expiration depuis la config
 * - AuthService pour la logique métier
 * - AuthController pour les endpoints
 */
@Module({
  imports: [
    // Module Users pour accéder aux utilisateurs
    UsersModule,
    
    // Configuration de Passport
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    
    // Configuration du module JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn', '900s'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  exports: [
    AuthService,
    JwtModule,
    PassportModule,
  ],
})
export class AuthModule {}
