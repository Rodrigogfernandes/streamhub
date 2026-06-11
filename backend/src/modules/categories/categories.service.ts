import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  async findAll() {
    return this.repo.find({ order: { sortOrder: 'ASC', name: 'ASC' } });
  }

  async findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: Partial<Category>) {
    const cat = this.repo.create(dto);
    return this.repo.save(cat);
  }
}
