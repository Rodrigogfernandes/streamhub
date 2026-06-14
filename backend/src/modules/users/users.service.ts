import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly model: Model<User>) {}

  async findByEmail(email: string) {
    return this.model.findOne({ email }).exec();
  }

  async create(email: string, password: string, name: string) {
    const existing = await this.findByEmail(email);
    if (existing) throw new Error('Email já cadastrado');

    const hashed = await bcrypt.hash(password, 10);
    const doc = new this.model({ email, password: hashed, name });
    return doc.save();
  }

  async findById(id: string) {
    return this.model.findById(id).exec();
  }
}
