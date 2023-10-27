import {    SubscribeMessage,
            WebSocketGateway,
            WebSocketServer,
            WsResponse }
from '@nestjs/websockets';
import { Server } from 'ws';

@WebSocketGateway(8080)
export class GameserverGateway {

    @WebSocketServer()
    server: Server;

    handleConnection(client: any) {
        console.log('New client connected');
    }

    



}
