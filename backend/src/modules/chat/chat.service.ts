/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { MessagesService } from './messages.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly usersService: UsersService,
    private readonly messagesService: MessagesService,
  ) {}

  addUser(nick: string, socketId: string) {
    return this.usersService.addUser(nick, socketId);
  }

  removeUser(socketId: string) {
    return this.usersService.removeUser(socketId);
  }

  findUserByNick(nick: string) {
    return this.usersService.findByNick(nick);
  }

  findUserBySocketId(socketId: string) {
    return this.usersService.findBySocketId(socketId);
  }

  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  saveMessage(from: string, to: string, message: string) {
    return this.messagesService.saveMessage(from, to, message);
  }

  getMessagesBetweenUsers(user1: string, user2: string) {
    return this.messagesService.getMessagesBetweenUsers(user1, user2);
  }

  getAllConversationsForUser(nick: string) {
    return this.messagesService.getAllConversationsForUser(nick);
  }
}