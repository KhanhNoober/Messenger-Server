import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Message } from 'src/models/chat.model';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
    @Prop()
    id: string;

    @Prop()
    messages: Message[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);