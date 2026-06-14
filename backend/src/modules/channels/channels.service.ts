import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Channel } from './channel.schema';

@Injectable()
export class ChannelsService {
  constructor(@InjectModel(Channel.name) private readonly model: Model<Channel>) {}

  async create(dto: any) {
    const doc = new this.model(dto);
    return doc.save();
  }

  async findAll(query: any) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const filter: any = { isActive: true };
    if (query.categoryId) filter.categoryId = query.categoryId;
    if (query.search) filter.name = new RegExp(query.search, 'i');

    const [data, total] = await Promise.all([
      this.model.find(filter).skip(skip).limit(limit).sort({ qualityScore: -1 }).exec(),
      this.model.countDocuments(filter),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string) {
    return this.model.findById(id).exec();
  }

  async update(id: string, dto: any) {
    return this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async remove(id: string) {
    return this.model.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
  }

  async bulkUpsert(channels: any[]) {
    return this.model.bulkWrite(
      channels.map((ch) => ({
        updateOne: {
          filter: { streamUrl: ch.streamUrl },
          update: { $set: ch },
          upsert: true,
        },
      })),
    );
  }
}
