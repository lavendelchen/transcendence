import {	SubscribeMessage,
			WebSocketGateway,
			WebSocketServer,
			WsResponse,
			MessageBody,
			ConnectedSocket }
from '@nestjs/websockets';
import { Server, Socket } from 'ws';

@WebSocketGateway(5174, {cors: {origin: '*', methods: ['GET', 'POST']}})
export class GameserverGateway {

	@WebSocketServer()
	server: Server;

	handleConnection(client: any) {
		console.log('New client connected');
	}
	
	handleDisconnect(client: any) {
		// Handle disconnection event
	}

	handleError(client: any, ...args: any[]) {
		console.error(args);
	}

	@SubscribeMessage('message')
	handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
		this.server.emit('message', data); // Broadcast the message to all connected clients
	}
}
