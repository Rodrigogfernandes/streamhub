import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImportJob, ImportJobSchema } from './import-job.schema';
import { ImportService } from './import.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ImportJob.name, schema: ImportJobSchema }]),
  ],
  controllers: [],
  providers: [ImportService],
  exports: [ImportService],
})
export class ImportModule {}
