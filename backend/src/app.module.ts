import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ChannelsModule } from './modules/channels/channels.module';
import { ImportModule } from './modules/import/import.module';
import { AiModule } from './modules/ai/ai.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EpgModule } from './modules/epg/epg.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { UploadModule } from './modules/upload/upload.module';

import config from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/streamhub'),
    ScheduleModule.forRoot(),

    ChannelsModule,
    ImportModule,
    AiModule,
    AuthModule,
    UsersModule,
    EpgModule,
    CategoriesModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
