import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'channels' })
export class Channel extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  originalName: string;

  @Prop()
  logoUrl: string;

  @Prop()
  streamUrl: string;

  @Prop()
  description: string;

  @Prop()
  country: string;

  @Prop()
  language: string;

  @Prop({ type: Number })
  ageRating: number;

  @Prop({ type: Boolean, default: true })
  isAdult: boolean;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop({ type: Number })
  qualityScore: number;

  @Prop({ type: String })
  categoryId: string;

  @Prop({ type: String })
  createdById: string;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
ChannelSchema.index({ name: 1, streamUrl: 1 }, { unique: true });
ChannelSchema.index({ categoryId: 1, isActive: 1 });
ChannelSchema.index({ qualityScore: -1 });
