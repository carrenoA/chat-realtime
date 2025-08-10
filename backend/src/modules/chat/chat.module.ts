import { Module, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

import { Message, MessageSchema } from './schemas/message.schema';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    UsersModule,
  ],
  providers: [
    ChatService,
    ChatGateway,
    {
      provide: 'APP_PIPE',
      useClass: ValidationPipe,
    },
  ],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
