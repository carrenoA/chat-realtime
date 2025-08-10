/* eslint-disable prettier/prettier */
import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { sendMessageDto } from './dto/send-message.dto';
import { SetNickDto } from './dto/set-nick.dto';
import { GetMessagesHistoryDto } from './dto/get-messages-history.dto';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'],
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private server: Server;

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    this.server = server;
    console.log('WebSocket server iniciado');
  }

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
    await this.chatService.removeUser(client.id);
    this.emitUsersList();
  }

  @SubscribeMessage('setNick')
  async handleSetNick(@MessageBody() payload: SetNickDto, @ConnectedSocket() client: Socket) {
    const { nick } = payload;
    const existingUser = this.chatService.findUserByNick(nick);
    if (existingUser) {
      client.emit('nickError', 'El nick ya está en uso.');
      return;
    }
    await this.chatService.addUser(nick, client.id);
    client.emit('nickSet', nick);
    this.emitUsersList();
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() payload: sendMessageDto, @ConnectedSocket() client: Socket) {
    const fromUser = this.chatService.findUserBySocketId(client.id);
    if (!fromUser) return;

    const toUser = this.chatService.findUserByNick(payload.to);
    if (!toUser) {
      client.emit('errorMessage', 'Usuario destino no conectado.');
      return;
    }

    const savedMessage = await this.chatService.saveMessage(fromUser.nick, toUser.nick, payload.message);

    this.server.to(toUser.socketId).emit('receiveMessage', {
      id: savedMessage._id.toString(),
      from: fromUser.nick,
      message: payload.message,
      timestamp: savedMessage.createdAt,
    });

    client.emit('messageSent', {
      to: toUser.nick,
      message: payload.message,
      timestamp: savedMessage.createdAt,
    });
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(@MessageBody() payload: GetMessagesHistoryDto, @ConnectedSocket() client: Socket) {
    const fromUser = this.chatService.findUserBySocketId(client.id);
    if (!fromUser) return;

    const messages = await this.chatService.getMessagesBetweenUsers(fromUser.nick, payload.withUser);
    client.emit('messagesHistory', messages);
  }

  @SubscribeMessage('getAllConversations')
  async handleGetAllConversations(@ConnectedSocket() client: Socket) {
    const fromUser = this.chatService.findUserBySocketId(client.id);
    if (!fromUser) return;

    const conversations = await this.chatService.getAllConversationsForUser(fromUser.nick);
    client.emit('allConversations', conversations);
  }

  private emitUsersList() {
    const allNicks = this.chatService.getAllUsers();

    for (const nick of allNicks) {
      const user = this.chatService.findUserByNick(nick);
      if (!user) continue;

      const otherNicks = allNicks.filter(n => n !== nick);
      this.server.to(user.socketId).emit('usersList', otherNicks);
    }
  }
}
