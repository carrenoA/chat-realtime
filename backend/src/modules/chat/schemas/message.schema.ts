import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & 
  Document & {
    _id: Types.ObjectId;
    createdAt: Date;  
    updatedAt: Date;  
  };

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  from: string; 

  @Prop({ required: true })
  to: string;  

  @Prop({ required: true })
  message: string; 
}

// Schema usable por Mongoose a partir de la clase Message.
export const MessageSchema = SchemaFactory.createForClass(Message);
