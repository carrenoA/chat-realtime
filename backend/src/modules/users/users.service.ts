/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserConnected } from './types/types';

@Injectable()
export class UsersService {
  private connectedUsers: UserConnected[] = [];

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async addUser(nick: string, socketId: string) {
    await this.userModel.deleteOne({ nick }).exec();
    this.connectedUsers.push({ nick, socketId });
    return this.userModel.create({ nick, socketId });
  }

  async removeUser(socketId: string) {
    this.connectedUsers = this.connectedUsers.filter(
      (u) => u.socketId !== socketId,
    );
    return this.userModel.deleteOne({ socketId }).exec();
  }

  findBySocketId(socketId: string): UserConnected | undefined {
    return this.connectedUsers.find((u) => u.socketId === socketId);
  }

  findByNick(nick: string): UserConnected | undefined {
    return this.connectedUsers.find((u) => u.nick === nick);
  }

  getAllUsers(): string[] {
    return this.connectedUsers.map((u) => u.nick);
  }
}
