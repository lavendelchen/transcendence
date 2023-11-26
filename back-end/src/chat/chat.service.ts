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
    check = check.toLowerCase();
    switch (check) {
      case '/kick':
        this.kickUser(data);
        break;
      case '/promote':
        this.promoteUser(data);
        break;
      case '/add':
        this.addUserToChannel(data);
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

  private async addUserToChannel(data: IMessage) {
    try {
      const name = data.input.substring(data.input.indexOf(' ') + 1);
      const user = await this.userService.findOneByName(name);
      if (!user) {
        console.log('user not found');
        return;
      }
      await this.chatDao.addUserToChannel(data.room, name);
      await this.broadcastToRoom(data, `${name} got added`);
    } catch (error) {
      console.log(`SYSTEM: ${error.message.split('\n')[0]}`);
    }
  }

  private async kickUser(data: IMessage) {
    console.log('kick user');
    try {
      const name = data.input.substring(data.input.indexOf(' ') + 1);
      if (
        !(await this.chatDao.isChannelAdmin(data.room, data.user.name)) &&
        !(await this.chatDao.isChannelOwner(data.room, data.user.name))) {
        console.log('you are not admin or owner');
        return;
      }
      if (!(await this.chatDao.isUserInChannel(data.room, name))) {
        console.log('user is not in channel');
        return;
      }
      console.log('is channel owner: ', this.chatDao.isChannelOwner(data.room, name));
      if (await this.chatDao.isChannelOwner(data.room, name)) {
        console.log('you can\'t kick the owner: ');
        return;
      }
      if (name === data.user.name) {
        console.log('you can\'t kick yourself');
        return;
      }
      await this.chatDao.removeUserFromChannel(data.room, name);
      await this.broadcastToRoom(data, `${name} got kicked`);
    } catch (error) {
      console.log(`SYSTEM: ${error.message.split('\n')[0]}`);
    }
  }

  private async promoteUser(data: IMessage) {
    try {
      const name = data.input.substring(data.input.indexOf(' ') + 1);
      if (
        !(await this.chatDao.isChannelAdmin(data.room, data.user.name)) &&
        !await (this.chatDao.isChannelOwner(data.room, data.user.name))) {
        console.log('you are not admin or owner');
        return;
      }
      if (!(await this.chatDao.isUserInChannel(data.room, name))) {
        console.log('user is not in channel');
        return;
      }
      if (await this.chatDao.isChannelOwner(data.room, name)) {
        console.log('you can\'t promote the owner');
        return;
      }
      if (name === data.user.name) {
        console.log('you can\'t promote yourself');
        return;
      }
      await this.chatDao.promoteUsertoChannelAdmin(data.room, name);
      await this.broadcastToRoom(data, `${name} got promoted to admin`);
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
