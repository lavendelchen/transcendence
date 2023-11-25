// chat.service.ts

import { Injectable } from '@nestjs/common';
import { IMessage } from 'src/chat/properties';
import { Server } from 'ws';
import { ChatServiceBase } from './chat.servicebase';

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
      this.broadcastToRoom(data, msg)
      await this.chatDao.saveMessageToChannel(data);
    } catch (error) {
      console.log(`SYSTEM: ${error.message.split('\n')[0]}`);
    }
  }

  // private async checkUserBlocked(conectionID: number) {
  //   const user = await this.userService.
  // }

  private async checkUserBlocked(id: number, potentialBlockedUser: number) {
    const data = await this.userService.findBlockedUser(id);
    for (let i = 0; i < data.blockedUser.length; i++) {
      if (data.blockedUser[i] === potentialBlockedUser)
        return true;
    }
    return false;
  }

  // UTILS
  private async broadcastToRoom(data: IMessage, msg: string) {
    const usersInRoom = await this.chatDao.getUsersInChannel(data.room);
    const currentConnections = this.wSocketGateway.getCurrentConnections();

    const msg_to_client = {
      event: "message",
      data: msg
    }

    for (const user of usersInRoom) {
      const connection = currentConnections.find(connection => connection.id === user.id);
      if (connection) {
        try {
          connection.socket.send(JSON.stringify(msg_to_client));
        }
        catch (error) {
          console.error('Error sending message:', error.message.split('\n')[0]);
        }
      }
    }
  }

}

