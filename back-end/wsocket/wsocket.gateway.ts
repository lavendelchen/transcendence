// wsocket.gateway.ts

import { Server, Socket } from 'ws';
import { ChatService } from 'src/chat/chat.service';
import { Injectable } from '@nestjs/common';
import { IMessage, IChannel } from 'src/chat/properties';
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

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: any): Promise<void> {
    console.log('received message');
    // this may be provisory but somehow I could not process the data directly
    try {
      const convertedReceivedData: IMessage = {
        user: {
          id: data.sendMessage.user.id,
          name: data.sendMessage.user.name,
          intraname: data.sendMessage.user.intraname,
          twoFAenabled: data.sendMessage.user.twoFAenabled,
          image: data.sendMessage.user.image,
          token: data.sendMessage.user.token,
          activeChats: data.sendMessage.user.activeChats,
        },
        input: data.sendMessage.input,
        room: data.sendMessage.room,
      };
      await this.chatService.processMessage(convertedReceivedData, this.server);
    } catch (error) {
      console.error('Error processing message:', error);
    }
    // Broadcast the updated chat history to all connected clients
    // const chatHistory = await this.chatService.getChatHistory();
    // this.server.emit('chatHistory', chatHistory);
  }


  @SubscribeMessage('create')
  async addChat(
    @MessageBody() data: IChannel,
  ): Promise<string[]> {
    return await this.chatService.addChat(data);
  }

  handleConnection(client: WebSocket, ...args: any[]) {
    console.log('Client connected: ', (client as any)._socket.remoteAddress);
    // Additional logic for handling new connections...
  }

  afterInit(server: any): any {
    console.log('WebSocket server initialized!');
  }
}
