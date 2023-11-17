// chat.service.ts

import { Injectable } from '@nestjs/common';
import { IMessage } from 'src/chat/properties';
import { Server } from 'ws';
import { roomConnections } from '../chat/properties';

@Injectable()
export class ChatService {
  private chatHistory: IMessage[] = [];

  async processMessage(data: IMessage, server: Server): Promise<string> {
    // this.chatHistory.push(message);
    await this.printMessage(data, server)
    return Promise.resolve('Message received and processed successfully.');
  }

  private async printMessage(
    data: IMessage,
    server: Server,
  ) {
    try {
      const msg = `${data.user.name}: ${data.input}`;
      this.broadcastToRoom(data.room, msg)
      // await this.chatDao.saveMessageToChannel(data);
    } catch (error) {
      console.log(`SYSTEM: ${error.message.split('\n')[0]}`);
    }
  }

  getChatHistory(): Promise<IMessage[]> {
    return Promise.resolve(this.chatHistory);
  }

  // UTILS 
  private async broadcastToRoom(room: string, message: string) {
    const connections = roomConnections[room] || [];

    for (const connection of connections) {
      connection.send(message);
    }
  }
}
