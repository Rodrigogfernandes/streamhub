import { Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImportJob } from './import-job.entity';
import { Logger } from '@nestjs/common';

@Processor('import')
export class ImportProcessor {
  private readonly logger = new Logger(ImportProcessor.name);

  constructor(
    @InjectRepository(ImportJob)
    private readonly importJobRepo: Repository<ImportJob>,
  ) {}

  async process(job: Job<any>) {
    const { jobId, channels } = job.data;
    this.logger.log(`Processando importação ${jobId} com ${channels.length} canais`);

    for (let i = 0; i < channels.length; i++) {
      await this.importJobRepo.update(jobId, {
        processedChannels: i + 1,
        totalChannels: channels.length,
      });
      await new Promise((r) => setTimeout(r, 10));
    }

    await this.importJobRepo.update(jobId, { status: 'COMPLETED' });
    this.logger.log(`Importação ${jobId} concluída`);
    return { processed: channels.length };
  }
}
