import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { ChannelsModule } from '../channels/channels.module';
import { ImportJob } from './import-job.entity';
import { ImportProcessor } from './import.processor';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';

@Module({
  imports: [
    ChannelsModule,
    TypeOrmModule.forFeature([ImportJob]),
    BullModule.registerQueue({ name: 'import' }),
  ],
  controllers: [ImportController],
  providers: [ImportService, ImportProcessor],
  exports: [ImportService],
})
export class ImportModule {}
