import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from 'src/models/chat.model';
import { Chat, ChatDocument } from 'src/schemas/chat.schema';

@Injectable()
export class ChatService {
    constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) { }

    async create(chat: Chat): Promise<Chat> {
        const createdChat = new this.chatModel(chat);
        return createdChat.save();
    }

    async findAll(): Promise<Chat[]> {
        return this.chatModel.find().exec();
    }

    async findOne(id: string): Promise<Chat> {
        return this.chatModel.findOne({ id }).exec();
    }

    async addMessage(id: string, message: Message): Promise<void> {
        this.chatModel.findOne({ id }).exec().then((chat) => {
            chat.messages.push(message);
            chat.save();
        });
    }
}
