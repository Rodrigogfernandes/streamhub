import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { EpgService } from './epg.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('epg')
export class EpgController {
  constructor(private readonly epgService: EpgService) {}

  @UseGuards(JwtAuthGuard)
  @Get('channel/:channelId')
  findByChannel(@Param('channelId') channelId: string, @Param('start') start?: string, @Param('end') end?: string) {
    return this.epgService.findByChannel(channelId);
  }
}
