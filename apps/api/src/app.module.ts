import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CreativesModule } from './modules/creatives/creatives.module';
import { ContactModule } from './modules/contact/contact.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env', '.env.local'],
    }),
    PrismaModule,
    CreativesModule,
    ContactModule,
  ],
})
export class AppModule {}