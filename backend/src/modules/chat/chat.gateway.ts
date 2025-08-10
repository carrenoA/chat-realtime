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
import { MessageDocument } from './schemas/message.schema';

interface User {
  socketId: string;
  nick: string;
}

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'],
})
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

  async handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
    this.connectedUsers = this.connectedUsers.filter(
      (user) => user.socketId !== client.id,
    );
    await this.chatService.removeUser(client.id);
    this.emitUsersList();
  }

  @SubscribeMessage('setNick')
  async handleSetNick(
    @MessageBody() nick: string,
    @ConnectedSocket() client: Socket,
  ) {
    const existingUser = this.connectedUsers.find((user) => user.nick === nick);
    if (existingUser) {
      client.emit('nickError', 'El nick ya está en uso.');
      return;
    }
    this.connectedUsers.push({ socketId: client.id, nick });
    await this.chatService.addUser(nick, client.id);
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

    const savedMessage = (await this.chatService.saveMessage(
      fromUser.nick,
      toUser.nick,
      payload.message,
    )) as MessageDocument;

    this.server.to(toUser.socketId).emit('receiveMessage', {
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

  @SubscribeMessage('getAllConversations')
  async handleGetAllConversations(@ConnectedSocket() client: Socket) {
    const fromUser = this.connectedUsers.find(
      (user) => user.socketId === client.id,
    );
    if (!fromUser) return;

    const conversations = await this.chatService.getAllConversationsForUser(
      fromUser.nick,
    );

    client.emit('allConversations', conversations);
  }

  private emitUsersList() {
    const nicks = this.connectedUsers.map((user) => user.nick);
    this.server.emit('usersList', nicks);
  }
}
