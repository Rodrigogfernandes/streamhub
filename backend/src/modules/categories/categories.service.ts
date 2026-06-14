import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './category.schema';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private readonly model: Model<Category>) {}

  async findAll() {
    return this.model.find().sort({ sortOrder: 1, name: 1 }).exec();
  }

  async findOne(id: string) {
    return this.model.findById(id).exec();
  }

  async create(dto: { name: string; icon?: string; sortOrder?: number }) {
    const doc = new this.model(dto);
    return doc.save();
  }
}
