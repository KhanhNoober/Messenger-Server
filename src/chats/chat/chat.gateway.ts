import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Message, Chat } from 'src/models/chat.model';
import { ChatService } from 'src/services/chat/chat.service';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer() server;

  constructor(private chatService: ChatService) { }

  handleConnection(client: any, ...args: any[]) {
    console.log('client connected', client.id)
  }

  handleDisconnect(client: any) {
    console.log('client disconnected', client.id)
  }

  @SubscribeMessage('join')
  handleJoin(client: any, payload: any): void {
    const { id } = payload;

    this.chatService.findOne(id).then((chat) => {
      if (chat) {
        this.server.emit('join', chat.messages);
      } 
    });

  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): void {
    const { roomId, text, from, date } = payload;

    const chat = this.chatService.findOne(roomId);

    const messageObj: Message = {
      id: uuidv4(),
      from: from,
      text: text,
      date: date,
    };

    chat.then((chat) => {
      if (chat) {
        this.chatService.addMessage(roomId, messageObj);
      } else {
        const newChat: Chat = {
          id: roomId,
          messages: [messageObj],
        };

        this.chatService.create(newChat);
      }
    })


    this.server.emit('message', messageObj);
  }
}
