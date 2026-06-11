import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { QueryChannelDto } from './dto/query-channel.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  findAll(@Query() query: QueryChannelDto) {
    return this.channelsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateChannelDto, @Request() req) {
    return this.channelsService.create({ ...dto, createdById: req.user.id });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('bulk')
  @HttpCode(HttpStatus.ACCEPTED)
  bulkUpsert(@Body() channels: CreateChannelDto[]) {
    return this.channelsService.bulkUpsert(channels);
  }
}
