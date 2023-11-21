import { Server, Socket } from 'ws';
import { ChatService } from 'src/chat/chat.service';
import { ChatDAO } from 'src/chat/chat.dao';
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

  handleDisconnect(client: WebSocket, ...args: any[]) {
    console.log('Client disconnected: ', (client as any)._socket.remoteAddress);
    // remove from currentConnections
  }

  @SubscribeMessage('connect')
  addChatUser(client: Socket, data: IChatUser) {
    console.log('Client connected: ', (client as any)._socket.remoteAddress);
    const newChatUser: IChatUser = {
      id: data.id,
      socket: client,
    }
    currentConnections[data.id] = newChatUser;
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: IMessage): Promise<void> {
    console.log('received message: ', data);
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
}
