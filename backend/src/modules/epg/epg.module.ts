import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EpgProgram, EpgProgramSchema } from './epg-program.schema';
import { EpgService } from './epg.service';
import { EpgController } from './epg.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: EpgProgram.name, schema: EpgProgramSchema }])],
  controllers: [EpgController],
  providers: [EpgService],
  exports: [EpgService],
})
export class EpgModule {}
