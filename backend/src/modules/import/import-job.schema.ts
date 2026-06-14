import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'import_jobs' })
export class ImportJob extends Document {
  @Prop({ required: true, enum: ['M3U_URL', 'M3U_FILE', 'XTREAM', 'JSON', 'API'] })
  sourceType: string;

  @Prop({ required: true })
  source: string;

  @Prop({ type: Number, default: 0 })
  totalChannels: number;

  @Prop({ type: Number, default: 0 })
  processedChannels: number;

  @Prop({ type: String, default: 'PENDING' })
  status: string;

  @Prop()
  error: string;
}

export const ImportJobSchema = SchemaFactory.createForClass(ImportJob);
ImportJobSchema.index({ status: 1, createdAt: -1 });
