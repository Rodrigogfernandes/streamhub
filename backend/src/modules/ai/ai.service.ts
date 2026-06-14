import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiClassification } from './ai-classification.schema';

@Injectable()
export class AiService {
  constructor(@InjectModel(AiClassification.name) private readonly model: Model<AiClassification>) {}

  async createClassification(data: Partial<AiClassification>) {
    const doc = new this.model(data);
    return doc.save();
  }

  async findByChannel(channelId: string) {
    return this.model.find({ channelId }).sort({ createdAt: -1 }).limit(1).exec();
  }
}
