import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { AiClassification } from './ai-classification.entity';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { Channel } from '../channels/channel.entity';
import { ChannelsModule } from '../channels/channels.module';

@Module({
  imports: [
    ChannelsModule,
    TypeOrmModule.forFeature([AiClassification, Channel]),
    BullModule.registerQueue({ name: 'ai' }),
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
