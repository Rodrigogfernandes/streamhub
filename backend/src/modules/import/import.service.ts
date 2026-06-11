import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImportJob } from './import-job.entity';

@Injectable()
export class ImportService {
  constructor(
    @InjectRepository(ImportJob)
    private readonly repo: Repository<ImportJob>,
  ) {}

  async createJob(sourceType: ImportJob['sourceType'], source: string) {
    const job = this.repo.create({ sourceType, source, status: 'PENDING' });
    return this.repo.save(job);
  }

  async updateProgress(id: string, processed: number, total: number) {
    await this.repo.update(id, { processedChannels: processed, totalChannels: total });
  }

  async markCompleted(id: string) {
    await this.repo.update(id, { status: 'COMPLETED' });
  }

  async markFailed(id: string, error: string) {
    await this.repo.update(id, { status: 'FAILED', error });
  }
}
