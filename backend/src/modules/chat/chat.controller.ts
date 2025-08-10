import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { GetMessagesParams } from './dto/get-messages.params';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages/:user1/:user2')
  async getMessages(@Param() params: GetMessagesParams) {
    return this.chatService.getMessagesBetweenUsers(params.user1, params.user2);
  }

  @Get('users')
  getUsers() {
    return this.chatService.getAllUsers();
  }
}
