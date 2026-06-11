import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ChannelsModule } from './modules/channels/channels.module';
import { ImportModule } from './modules/import/import.module';
import { AiModule } from './modules/ai/ai.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EpgModule } from './modules/epg/epg.module';
import { CategoriesModule } from './modules/categories/categories.module';

import config from './config/configuration';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
        },
      }),
    }),
    BullModule.registerQueue({ name: 'import' }),
    BullModule.registerQueue({ name: 'ai' }),
    TypeOrmModule.forRootAsync({ useFactory: getDatabaseConfig }),
    ScheduleModule.forRoot(),

    ChannelsModule,
    ImportModule,
    AiModule,
    AuthModule,
    UsersModule,
    EpgModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
