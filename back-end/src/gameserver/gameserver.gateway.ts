import {	SubscribeMessage,
			WebSocketGateway,
			WebSocketServer,
			WsResponse }
from '@nestjs/websockets';
import { Server } from 'ws';



@WebSocketGateway(5174, {cors: {origin: '*', methods: ['GET', 'POST']}})
export class GameserverGateway {

	@WebSocketServer()
	server: Server;

	handleConnection(client: any) {
		console.log('New client connected');
	}
	handleError(client: any, ...args: any[]) {
		console.error(args);
	}
}
