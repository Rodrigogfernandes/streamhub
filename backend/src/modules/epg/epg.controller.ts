import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { EpgService } from './epg.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('epg')
export class EpgController {
  constructor(private readonly epgService: EpgService) {}

  @UseGuards(JwtAuthGuard)
  @Get('channel/:channelId')
  async findByChannel(
    @Param('channelId') channelId: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    const startTime = start ? new Date(start) : undefined;
    const endTime = end ? new Date(end) : undefined;
    return this.epgService.findByChannel(channelId, startTime, endTime);
  }
}
