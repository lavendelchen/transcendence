// chat.service.ts

import { Injectable } from '@nestjs/common';
import { IMessage } from 'src/chat/properties';
import { Server } from 'ws';
import { ChatServiceBase } from './chat.servicebase';
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

  public async processMessage(data: IMessage, server: Server): Promise<string> {
		let check = data.input;
		console.log("DATA INPUT")
		console.log(data.input)
		console.log("DATA END")
		if (data.input && data.input.indexOf(' ') !== -1)
		  check = data.input.substring(0, data.input.indexOf(' '));
		switch (check) {
		  case '/ban':
      this.banUser(data, server);
			//this.banUser(data, server);
			break;
      case '/fuck_chris':
      console.log("yeah, fuck this dude")
		  default:
        await this.printMessage(data, server)
        return Promise.resolve('Message processed successfully.');
		}
  }

  async banUser(data: IMessage, server: Server) {
    console.log("this is the data.input")
    console.log(data.input)
    let banned_name = data.input.split(' ')[1];

    console.log("this is banned name")
    console.log(banned_name)
    const user = await this.userService.findOneByName(banned_name);
    if (!user) {
        throw new Error('User not found');
    }

    await this.userService.update(user.id, { isBanned: true });
    console.log(`User ${user.pseudo} has been banned.`);
  }

  public async getChatHistory(data: string): Promise<string[]> {
    const channelInfo = await this.chatDao.getChannelByTitle(data);
    const channelId = channelInfo.id;
    return this.chatDao.getRawChannelMessages(channelId);
  }

  private async printMessage( data: IMessage, server: Server ) {
    try {
      const msg = `${data.user.name}:${data.input}`;
      this.broadcastToRoom(data, msg)
      await this.chatDao.saveMessageToChannel(data);
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
      if (connection) {
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

}
