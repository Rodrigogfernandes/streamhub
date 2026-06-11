import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async create(email: string, password: string, name: string) {
    const existing = await this.findByEmail(email);
    if (existing) throw new ConflictException('Email já cadastrado');

    const hashed = await bcrypt.hash(password, 10);
    const user = this.repo.create({ email, password: hashed, name });
    return this.repo.save(user);
  }

  async findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }
}
