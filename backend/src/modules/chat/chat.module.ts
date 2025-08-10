import { Module, ValidationPipe } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UsersModule } from '../users/user.module';
import { MessagesModule } from './messages.module';

@Module({
  imports: [
    UsersModule,
    MessagesModule,  // Importa MessagesModule que ya tiene el modelo
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
