// wsocket.gateway.ts

import { Server, Socket } from 'ws';
import { ChatService } from 'src/chat/chat.service';
import { Injectable } from '@nestjs/common';
import {
  ConnectedSocket, //wird spaeter fuer join un dque gebraucht
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@Injectable()
@WebSocketGateway(9000, {cors: {origin: '*', methods: ['GET', 'POST']}})
export class WSocketGateway implements OnGatewayInit {
  constructor(private chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: any, client: Socket): Promise<void> {
    console.log('Received message:', data);
    
    // Forward the message to the ChatService for processing
    const result = await this.chatService.processMessage(data);

    // Send a response back to the client if needed
    client.send('messageResponse', result);
    
    // Broadcast the updated chat history to all connected clients
    const chatHistory = await this.chatService.getChatHistory();
    this.server.emit('chatHistory', chatHistory);
  }
  afterInit(server: any): any {}
}
