import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesService } from './messages.service';
import { Message, MessageSchema } from './schemas/message.schema';  // Importa el esquema aquí

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]), // Registrá el modelo aquí
  ],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
