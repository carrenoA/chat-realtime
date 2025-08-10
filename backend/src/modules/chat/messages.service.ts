/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async saveMessage(
    from: string,
    to: string,
    message: string,
  ): Promise<MessageDocument> {
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

    return messages.map((msg) => ({
      id: msg._id.toString(),
      from: msg.from,
      to: msg.to,
      message: msg.message,
      timestamp: msg.createdAt,
    }));
  }

  async getAllConversationsForUser(nick: string) {
    const messages = await this.messageModel
      .find({ $or: [{ from: nick }, { to: nick }] })
      .sort({ createdAt: 1 })
      .exec();

    const conversations = new Map<string, MessageDocument[]>();

    messages.forEach((msg) => {
      const otherUser = msg.from === nick ? msg.to : msg.from;
      if (!conversations.has(otherUser)) conversations.set(otherUser, []);
      conversations.get(otherUser)?.push(msg);
    });

    return Array.from(conversations.entries()).map(([user, msgs]) => ({
      user,
      messages: msgs,
    }));
  }
}
