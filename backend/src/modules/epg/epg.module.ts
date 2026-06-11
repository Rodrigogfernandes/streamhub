import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpgProgram } from './epg-program.entity';
import { EpgService } from './epg.service';
import { EpgController } from './epg.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EpgProgram])],
  controllers: [EpgController],
  providers: [EpgService],
  exports: [EpgService],
})
export class EpgModule {}
