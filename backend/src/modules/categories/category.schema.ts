import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'categories' })
export class Category extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  icon: string;

  @Prop({ type: Number, default: 0 })
  sortOrder: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
