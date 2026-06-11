import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EpgProgram } from './epg-program.entity';

@Injectable()
export class EpgService {
  constructor(
    @InjectRepository(EpgProgram)
    private readonly repo: Repository<EpgProgram>,
  ) {}

  async findByChannel(channelId: string, startTime?: Date, endTime?: Date) {
    const qb = this.repo.createQueryBuilder('program')
      .where('program.channelId = :channelId', { channelId })
      .andWhere('program.endTime > :now', { now: new Date() })
      .orderBy('program.startTime', 'ASC');

    if (startTime) qb.andWhere('program.startTime >= :start', { start: startTime });
    if (endTime) qb.andWhere('program.endTime <= :end', { end: endTime });

    return qb.getMany();
  }

  async upsertBatch(programs: Partial<EpgProgram>[]) {
    return this.repo.upsert(programs, ['channelId', 'startTime', 'endTime']);
  }
}
