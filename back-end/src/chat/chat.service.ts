// chat.service.ts

import { Injectable } from '@nestjs/common';
import { IMessage } from 'src/chat/properties';
import { Server } from 'ws';
import { ChatServiceBase } from './chat.servicebase';

@Injectable()
export class ChatService extends ChatServiceBase {

  public async processMessage(data: IMessage, server: Server) {
    let check = data.input;
    if (data.input.indexOf(' ') != -1)
      check = data.input.substring(0, data.input.indexOf(' '));
    switch (check) {
      case '/kick':
        this.kickUser(data);
        break;
      case '/promote':
        this.promoteUser(data);
        break;
      default:
        this.printMessage(data);
    }
  }

  private async printMessage(data: IMessage) {
    try {
      const msg = `${data.user.name}:${data.input}`;
      this.broadcastToRoom(data, msg)
      await this.chatDao.saveMessageToChannel(data);
    } catch (error) {
      console.log(`SYSTEM: ${error.message.split('\n')[0]}`);
    }
  }

  private async kickUser(data: IMessage) {
    try {
      const name = data.input.substring(data.input.indexOf(' ') + 1);
      // only channel admin or owner can kick
      if (
        !(this.chatDao.isChannelAdmin(data.room, data.user.name)) &&
        !(this.chatDao.isChannelOwner(data.room, data.user.name)))
        return;
      // channel owner can't be kicked
      if (this.chatDao.isChannelOwner(data.room, name))
        return;
      // you can't kick yourself
      if (name === data.user.name)
        return;
      await this.chatDao.removeUserFromChannel(data.room, name);
      this.broadcastToRoom(data, `${name}: got kicked`);
    } catch (error) {
      console.log(`SYSTEM: ${error.message.split('\n')[0]}`);
    }
  }

  private async promoteUser(data: IMessage) {
    try {
      const name = data.input.substring(data.input.indexOf(' ') + 1);
      // only channel admin or owner can promote
      if (
        !(this.chatDao.isChannelAdmin(data.room, data.user.name)) &&
        !(this.chatDao.isChannelOwner(data.room, data.user.name)))
        return;
      // channel owner can't be promoted
      if (this.chatDao.isChannelOwner(data.room, name))
        return;
      // you can't promote yourself
      if (name === data.user.name)
        return;
      await this.chatDao.promoteUsertoChannelAdmin(data.room, name);
      this.broadcastToRoom(data, `${name}: got promoted to admin`);
    } catch (error) {
      console.log(`SYSTEM: ${error.message.split('\n')[0]}`);
    }
  }

  // UTILS
  private async broadcastToRoom(data: IMessage, msg: string) {
    console.log('broodcat to room: ', msg)
    const usersInRoom = await this.chatDao.getUsersInChannel(data.room);
    const currentConnections = this.wSocketGateway.getCurrentConnections();

    const msg_to_client = {
      event: "message",
      data: msg
    }

    for (const user of usersInRoom) {
      const connection = currentConnections.find(connection => connection.id === user.id);
      if (connection && connection.id !== data.user.id) {
        try {
          connection.socket.send(JSON.stringify(msg_to_client));
          console.log('message send succesfully');
        }
        catch (error) {
          console.error('Error sending message:', error.message.split('\n')[0]);
        }
      }
    }
  }

  public async getChatHistory(data: string): Promise<string[]> {
    const channelInfo = await this.chatDao.getChannelByTitle(data);
    const channelId = channelInfo.id;
    return this.chatDao.getRawChannelMessages(channelId);
  }

}
