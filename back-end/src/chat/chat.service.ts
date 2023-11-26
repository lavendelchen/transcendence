// chat.service.ts

import { Injectable } from '@nestjs/common';
import { IMessage } from 'src/chat/properties';
import { Server } from 'ws';
import { ChatServiceBase } from './chat.servicebase';
import { User } from '../entities/user.entity'
import { UserService } from 'src/user/user.service';
import { ChatDAO } from './chat.dao';
import { WSocketGateway } from 'src/wsocket/wsocket.gateway';

@Injectable()
export class ChatService extends ChatServiceBase {
    constructor(
        public userService: UserService,
        protected chatDao: ChatDAO,
        protected wSocketGateway: WSocketGateway,
    ) {
        super(userService, chatDao, wSocketGateway);
    }

  public async processMessage(data: IMessage, server: Server) {
    let check = data.input;
    if (data.input.indexOf(' ') != -1)
      check = data.input.substring(0, data.input.indexOf(' '));
    switch (check.toLowerCase()) {
      case '/kick':
        this.kickUser(data);
        break;
      case '/promote':
        this.promoteUser(data);
        break;
      case '/mute':
        this.muteUser(data)
        break;
			case '/ban':
				this.banUser(data, server);
        break;
      // case '/add':
      //   this.addUserToChannel(data);
      //   break;
      default:
        this.printMessage(data);
    }
  }


  private async sendServerMessageToClient(user: User, message: string) {
    const resolvedUser = await user;
    const currentConnections = this.wSocketGateway.getCurrentConnections();
    const connection = currentConnections.find(connection => connection.id === resolvedUser.id);
    const msg = `server:${message}`;
    const msg_to_client = {
      event: "message",
      data: msg
    }
    if (connection) {
      connection.socket.send(JSON.stringify(msg_to_client));
    }
}

  private async muteUser(data: IMessage) {
    const user = await this.userService.findOne(data.user.id);
    const splitedMessage = data.input.split(' ');
    if (splitedMessage.length < 2) {
      this.sendServerMessageToClient(user, "Missing argument: /mute <username>")
    }
    splitedMessage.shift()
    for (let i in splitedMessage) {
      try {
      var blockedUser = await this.userService.findOneByName(splitedMessage[i])
      } catch (error) {
        console.log('user does not exist')
        this.sendServerMessageToClient(user, "Could not find User " + splitedMessage[i])
        return
      }
      console.log(blockedUser.id)
      if (!user.blockedUser){
      user.blockedUser = [blockedUser.id]
      } else if (!this.checkUserBlocked(user.id, blockedUser.id)) {
        user.blockedUser.push(blockedUser.id)
      }
      this.userService.update(user.id, user)
      this.sendServerMessageToClient(user, splitedMessage[i] + " is muted")
    }
  }

	async banUser(data: IMessage, server: Server) {
    let banned_name = data.input.split(' ')[1];
    const user = await this.userService.findOneByName(banned_name);
    if (!user) {
        throw new Error('User not found');
    }

    await this.userService.update(user.id, { isBanned: true });
    await this.userService.update(user.id, { isAuthenticated: false });
    console.log(`User ${user.pseudo} has been banned.`);
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

  private async checkUserBlocked(id: number, potentialBlockedUser: number) {
    const data = await this.userService.findBlockedUser(id);
    for (let i = 0; i < data.blockedUser.length; i++) {
      if (data.blockedUser[i] === potentialBlockedUser)
        return true;
    }
    return false;
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
      if (connection && connection.id !== data.user.id && !this.checkUserBlocked(data.user.id, connection.id)) {
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

