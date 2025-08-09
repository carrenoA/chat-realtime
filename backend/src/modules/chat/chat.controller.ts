import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages/:user1/:user2')
  async getMessages(
    @Param('user1') user1: string,
    @Param('user2') user2: string,
  ) {
    return this.chatService.getMessagesBetweenUsers(user1, user2);
  }

  @Get('users')
  async getUsers() {
    return this.chatService.getAllUsers();
  }
}
