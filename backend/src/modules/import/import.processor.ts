import { Processor, WorkerHost } from '@nestjs/bull';
import { Job } from 'bull';
import { ImportService } from './import.service';
import { Logger } from '@nestjs/common';

@Processor('import')
export class ImportProcessor extends WorkerHost {
  private readonly logger = new Logger(ImportProcessor.name);

  constructor(private readonly importService: ImportService) {
    super();
  }

  async process(job: Job<any>) {
    const { jobId, channels } = job.data;
    this.logger.log(`Processando job ${jobId} com ${channels.length} canais`);

    for (let i = 0; i < channels.length; i++) {
      await this.importService.updateProgress(jobId, i + 1, channels.length);
      await new Promise(r => setTimeout(r, 50));
    }

    await this.importService.markCompleted(jobId);
    return { processed: channels.length };
  }
}
