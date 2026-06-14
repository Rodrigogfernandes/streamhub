import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiClassification, AiClassificationSchema } from './ai-classification.schema';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AiClassification.name, schema: AiClassificationSchema }]),
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
