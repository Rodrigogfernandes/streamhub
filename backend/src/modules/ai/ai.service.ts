import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiClassification } from './ai-classification.entity';

@Injectable()
export class AiService {
  constructor(
    @InjectRepository(AiClassification)
    private readonly aiRepo: Repository<AiClassification>,
  ) {}

  async createClassification(data: Partial<AiClassification>) {
    const record = this.aiRepo.create(data);
    return this.aiRepo.save(record);
  }

  async findByChannel(channelId: string) {
    return this.aiRepo.find({
      where: { channelId },
      order: { createdAt: 'DESC' },
      take: 1,
    });
  }
}
