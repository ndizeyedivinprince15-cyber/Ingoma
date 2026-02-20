import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfileModule } from './modules/profile/profile.module';
import { AidsModule } from './modules/aids/aids.module';
import { EligibilityModule } from './modules/eligibility/eligibility.module';
import { DossiersModule } from './modules/dossiers/dossiers.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env', '.env.local'],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ProfileModule,
    AidsModule,
    EligibilityModule,
    DossiersModule,
  ],
})
export class AppModule {}