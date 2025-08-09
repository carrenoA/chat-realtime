import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Mensajes
  async saveMessage(from: string, to: string, message: string) {
    const createdMessage = new this.messageModel({ from, to, message });
    return createdMessage.save();
  }

  async getMessagesBetweenUsers(user1: string, user2: string) {
    return this.messageModel
      .find({
        $or: [
          { from: user1, to: user2 },
          { from: user2, to: user1 },
        ],
      })
      .sort({ createdAt: 1 })
      .exec();
  }

  // Usuarios
  async addUser(nick: string, socketId: string) {
    return this.userModel.create({ nick, socketId });
  }

  async removeUser(socketId: string) {
    return this.userModel.deleteOne({ socketId }).exec();
  }

  async findUserByNick(nick: string) {
    return this.userModel.findOne({ nick }).exec();
  }

  async findUserBySocketId(socketId: string) {
    return this.userModel.findOne({ socketId }).exec();
  }

  async getAllUsers() {
    return this.userModel.find().exec();
  }
}
