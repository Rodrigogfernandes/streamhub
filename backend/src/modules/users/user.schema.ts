import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'users' })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name: string;

  @Prop({ type: String, enum: ['ADMIN', 'USER'], default: 'USER' })
  role: 'ADMIN' | 'USER';

  @Prop({ type: Object })
  preferences: Record<string, any>;

  @Prop({ type: Boolean, default: false })
  isAdultProfile: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
