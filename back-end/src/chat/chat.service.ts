// chat.service.ts

import { Injectable } from '@nestjs/common';
import { IMessage } from 'src/chat/properties';

@Injectable()
export class ChatService {
  private chatHistory: IMessage[] = [];

  processMessage(message: IMessage): Promise<string> {
    this.chatHistory.push(message);
    return Promise.resolve('Message received and processed successfully.');
  }

  getChatHistory(): Promise<IMessage[]> {
    return Promise.resolve(this.chatHistory);
  }
}
