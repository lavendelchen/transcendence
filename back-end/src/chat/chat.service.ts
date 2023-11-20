// chat.service.ts

import { Injectable } from '@nestjs/common';
import { IMessage } from 'src/chat/properties';
import { Server } from 'ws';
import { currentConnections } from '../chat/properties';
import { ChatServiceBase } from './chat.servicebase';
import { ChatDAO } from './chat.dao';

@Injectable()
export class ChatService extends ChatServiceBase {

  public async processMessage(data: IMessage, server: Server): Promise<string> {
    await this.printMessage(data, server)
    return Promise.resolve('Message processed successfully.');
  }

  public async getChatHistory(data: string): Promise<string[]> {
    const channelInfo = await this.chatDao.getChannelByTitle(data);
    const channelId = channelInfo.id;
    return this.chatDao.getRawChannelMessages(channelId);
  }

  private async printMessage(
    data: IMessage,
    server: Server,
  ) {
    try {
      const msg = `${data.user}:${data.input}`;
      this.broadcastToRoom(data.room, msg)
      await this.chatDao.saveMessageToChannel(data);
    } catch (error) {
      console.log(`SYSTEM: ${error.message.split('\n')[0]}`);
    }
  }

  // UTILS
  private async broadcastToRoom(room: string, msg: string) {
    const usersInRoom = await this.chatDao.getUsersInChannel(room);
    for (const user of usersInRoom) {
      for (const connection of currentConnections) {
        if (connection) {
          if (connection.id === user.id) {
            try {
              connection.socket.send(msg);
            }
            catch (error) {
              console.error('Error sending message:', error.message.split('\n')[0]);
            }
          }
        }
      }
    }
  }

}
