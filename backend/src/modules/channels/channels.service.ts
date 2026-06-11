import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { QueryChannelDto } from './dto/query-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepo: Repository<Channel>,
  ) {}

  async create(dto: CreateChannelDto, createdById?: string) {
    const channel = this.channelRepo.create({ ...dto, createdById } as any);
    return this.channelRepo.save(channel);
  }

  async findAll(query: QueryChannelDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const qb = this.channelRepo.createQueryBuilder('channel')
      .leftJoinAndSelect('channel.category', 'category')
      .where('channel.isActive = :active', { active: true });

    if (query.categoryId) qb.andWhere('channel.categoryId = :cat', { cat: query.categoryId });
    if (query.search) qb.andWhere('channel.name ILIKE :search', { search: `%${query.search}%` });

    const [data, total] = await qb
      .orderBy('channel.qualityScore', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const channel = await this.channelRepo.findOne({ where: { id } });
    if (!channel) throw new NotFoundException('Canal não encontrado');
    return channel;
  }

  async update(id: string, dto: UpdateChannelDto) {
    await this.channelRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const channel = await this.findOne(id);
    channel.isActive = false;
    return this.channelRepo.save(channel);
  }

  async bulkUpsert(channels: Partial<Channel>[]) {
    return this.channelRepo.upsert(channels, ['streamUrl']);
  }
}
