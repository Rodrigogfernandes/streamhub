import { Controller, Post, Body, UseGuards, Param, Get } from '@nestjs/common';
import { ImportService } from './import.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('m3u')
  importM3U(@Body() body: { url?: string; content?: string }) {
    return this.importService.createJob('M3U_URL', body.url || 'upload');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('xtream')
  importXtream(@Body() body: { server: string; username: string; password: string }) {
    return this.importService.createJob('XTREAM', `${body.server}:${body.username}`);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('json')
  importJson(@Body() body: { data: any[] }) {
    return this.importService.createJob('JSON', JSON.stringify(body.data).slice(0, 100));
  }

  @UseGuards(JwtAuthGuard)
  @Get('jobs/:id')
  getJob(@Param('id') id: string) {
    return this.importService.getJobById(id);
  }
}
