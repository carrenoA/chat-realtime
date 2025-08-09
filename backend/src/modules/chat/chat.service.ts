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

  async saveMessage(from: string, to: string, message: string) {
    const createdMessage = new this.messageModel({ from, to, message });
    return createdMessage.save();
  }

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
