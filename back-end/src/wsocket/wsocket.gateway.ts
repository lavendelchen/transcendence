import { Server, Socket } from 'ws';
import { ChatService } from 'src/chat/chat.service';
import { Inject } from '@nestjs/common';
import { Injectable, forwardRef } from '@nestjs/common';
import { IMessage, IChannel, IChatUser } from 'src/chat/properties';
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
  constructor(
    @Inject(forwardRef(() => ChatService))
    private chatService: ChatService,
  ) { }

  private currentConnections: IChatUser[] = [];

  @WebSocketServer()
  server: Server;

  afterInit(): any {
    console.log('WebSocket server initialized!');
  }

  handleDisconnect(client: WebSocket, ...args: any[]) {
    console.log('Client disconnected: ', (client as any)._socket.remoteAddress);
    const index = this.currentConnections.findIndex((connection) => connection.socket === client);
    if (index !== -1) {
      this.currentConnections.splice(index, 1);
    }
  }

  @SubscribeMessage('connect')
  addChatUser(client: Socket, data: IChatUser) {
    console.log('Client connected: ', (client as any)._socket.remoteAddress);
    const newChatUser: IChatUser = {
      id: data.id,
      socket: client,
    }
    this.currentConnections.push(newChatUser);
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
  ): Promise<void> {
    await this.chatService.addChat(data);
  }

  // UTILS
  public getCurrentConnections(): IChatUser[] {
    return this.currentConnections;
  }
}
