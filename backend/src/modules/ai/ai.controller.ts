import { Controller, Post, Body, Param } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('classify/:channelId')
  async classify(@Param('channelId') channelId: string, @Body() data: any) {
    return this.aiService.createClassification({ ...data, channelId });
  }

  @Post('classify-batch')
  async classifyBatch(@Body() data: { channels: string[]; importJobId: string }) {
    return { queued: data.channels.length };
  }
}
