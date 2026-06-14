import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EpgProgram } from './epg-program.schema';

@Injectable()
export class EpgService {
  constructor(@InjectModel(EpgProgram.name) private readonly model: Model<EpgProgram>) {}

  async findByChannel(channelId: string) {
    return this.model.find({ channelId, endTime: { $gt: new Date() } }).sort({ startTime: 1 }).exec();
  }

  async upsertBatch(programs: Partial<EpgProgram>[]) {
    return this.model.bulkWrite(
      programs.map((p) => ({
        updateOne: {
          filter: { channelId: p.channelId, startTime: p.startTime, endTime: p.endTime },
          update: { $set: p },
          upsert: true,
        },
      })),
    );
  }
}
