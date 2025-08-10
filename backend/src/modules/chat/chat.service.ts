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

  async getMessagesBetweenUsers(user1: string, user2: string) {
    const messages = await this.messageModel
      .find({
        $or: [
          { from: user1, to: user2 },
          { from: user2, to: user1 },
        ],
      })
      .sort({ createdAt: 1 })
      .exec();

    // Mapeo explícito para enviar timestamp con el nombre que espera el frontend
    return messages.map((msg) => ({
      from: msg.from,
      to: msg.to,
      message: msg.message,
      timestamp: msg.createdAt,
    }));
  }

  async getAllConversationsForUser(nick: string) {
    const messages = await this.messageModel
      .find({
        $or: [{ from: nick }, { to: nick }],
      })
      .sort({ createdAt: 1 })
      .exec();

    const conversations = new Map<string, MessageDocument[]>();

    messages.forEach((msg) => {
      const otherUser = msg.from === nick ? msg.to : msg.from;
      if (!conversations.has(otherUser)) {
        conversations.set(otherUser, []);
      }
      const userMessages = conversations.get(otherUser);
      if (userMessages) {
        userMessages.push(msg);
      }
    });

    return Array.from(conversations.entries()).map(([user, messages]) => ({
      user,
      messages,
    }));
  }

  async addUser(nick: string, socketId: string) {
    await this.userModel.deleteOne({ nick }).exec();
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
