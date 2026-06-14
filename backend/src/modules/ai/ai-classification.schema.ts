import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'ai_classifications' })
export class AiClassification extends Document {
  @Prop({ required: true })
  channelId: string;

  @Prop()
  detectedCategory: string;

  @Prop()
  detectedCountry: string;

  @Prop()
  detectedLanguage: string;

  @Prop({ type: Number })
  detectedAgeRating: number;

  @Prop({ type: Boolean, default: false })
  isAdult: boolean;

  @Prop({ type: Boolean, default: false })
  isDuplicate: boolean;

  @Prop({ type: Object })
  reasoning: Record<string, any>;
}

export const AiClassificationSchema = SchemaFactory.createForClass(AiClassification);
AiClassificationSchema.index({ channelId: 1, createdAt: -1 });
