import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImportJob } from './import-job.schema';

@Injectable()
export class ImportService {
  constructor(@InjectModel(ImportJob.name) private readonly model: Model<ImportJob>) {}

  async createJob(sourceType: string, source: string) {
    const doc = new this.model({ sourceType, source, status: 'PENDING' });
    return doc.save();
  }

  async updateProgress(id: string, processed: number, total: number) {
    return this.model.findByIdAndUpdate(id, { processedChannels: processed, totalChannels: total }).exec();
  }

  async markCompleted(id: string) {
    return this.model.findByIdAndUpdate(id, { status: 'COMPLETED' }).exec();
  }

  async markFailed(id: string, error: string) {
    return this.model.findByIdAndUpdate(id, { status: 'FAILED', error }).exec();
  }

  async getJobById(id: string) {
    return this.model.findById(id).exec();
  }
}
