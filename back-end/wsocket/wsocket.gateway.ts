// wsocket.gateway.ts

import { Server, Socket } from 'ws';
import { ChatService } from 'src/chat/chat.service';
import { ChatDAO } from '../src/chat/chat.dao';
import { Injectable } from '@nestjs/common';
import { IMessage, IChannel, currentConnections, IChatUser } from 'src/chat/properties';
import {
  ConnectedSocket, //wird spaeter fuer join un dque gebraucht
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@Injectable()
@WebSocketGateway(9000, { cors: { origin: '*', methods: ['GET', 'POST'] } })
export class WSocketGateway implements OnGatewayInit {
  constructor(private chatService: ChatService) { }

  @WebSocketServer()
  server: Server;

  afterInit(server: any): any {
    console.log('WebSocket server initialized!');
  }

  @SubscribeMessage('connect')
  addChatUser(client: Socket, message: IChatUser) {
    console.log('Client connected: ', (client as any)._socket.remoteAddress);
    const newChatUser: IChatUser = {
      id: message.id,
      socket: client,
    }
    currentConnections[message.id] = newChatUser;
  }

  @SubscribeMessage('disconnect')
  removeChatUser(client: Socket, message: IChatUser) {
    console.log('Client disconnected: ', (client as any)._socket.remoteAddress);
    delete currentConnections[message.id];
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: IMessage): Promise<void> {
    console.log('received message');
    try {
      await this.chatService.processMessage(data, this.server);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }

  @SubscribeMessage('create')
  async addChat(
    @MessageBody() data: IChannel,
  ): Promise<string[]> {
    return await this.chatService.addChat(data);
  }

  // @SubscribeMessage('history')
  // async getRawChannelMessages(@MessageBody() data: string): Promise<void> {
  //   // channelId = chatDao.getChannelByTitle(data);
  //   return await this.chatService.getRawChannelMessages(data);
  // }
}
