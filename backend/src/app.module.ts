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

import config from './config/configuration';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    BullModule.forRootAsync({ useFactory: () => ({ redis: { host: 'localhost', port: 6379 } }) }),
    TypeOrmModule.forRootAsync({ useFactory: getDatabaseConfig }),
    ScheduleModule.forRoot(),

    ChannelsModule,
    ImportModule,
    AiModule,
    AuthModule,
    UsersModule,
    EpgModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
