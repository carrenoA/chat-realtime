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

interface User {
  socketId: string;
  nick: string;
}

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private server: Server;
  private connectedUsers: User[] = [];

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    this.server = server;
    console.log('WebSocket server iniciado');
  }

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
    this.connectedUsers = this.connectedUsers.filter(
      (user) => user.socketId !== client.id,
    );
    this.emitUsersList();
  }

  @SubscribeMessage('setNick')
  handleSetNick(
    @MessageBody() nick: string,
    @ConnectedSocket() client: Socket,
  ) {
    const existingUser = this.connectedUsers.find((user) => user.nick === nick);
    if (existingUser) {
      client.emit('nickError', 'El nick ya está en uso.');
      return;
    }
    this.connectedUsers.push({ socketId: client.id, nick });
    client.emit('nickSet', nick);
    this.emitUsersList();
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() payload: { to: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const fromUser = this.connectedUsers.find(
      (user) => user.socketId === client.id,
    );
    if (!fromUser) return;

    const toUser = this.connectedUsers.find((user) => user.nick === payload.to);
    if (!toUser) {
      client.emit('errorMessage', 'Usuario destino no conectado.');
      return;
    }

    // Guardar el mensaje en la base de datos
    await this.chatService.saveMessage(
      fromUser.nick,
      toUser.nick,
      payload.message,
    );

    // Emitir mensaje al usuario destino
    this.server.to(toUser.socketId).emit('receiveMessage', {
      from: fromUser.nick,
      message: payload.message,
      timestamp: new Date(),
    });

    // Emitir mensaje al emisor para actualizar su chat
    client.emit('messageSent', {
      to: toUser.nick,
      message: payload.message,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(
    @MessageBody() payload: { withUser: string },
    @ConnectedSocket() client: Socket,
  ) {
    const fromUser = this.connectedUsers.find(
      (user) => user.socketId === client.id,
    );
    if (!fromUser) return;

    const messages = await this.chatService.getMessagesBetweenUsers(
      fromUser.nick,
      payload.withUser,
    );

    client.emit('messagesHistory', messages);
  }

  private emitUsersList() {
    const nicks = this.connectedUsers.map((user) => user.nick);
    this.server.emit('usersList', nicks);
  }
}
