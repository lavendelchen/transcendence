import {	SubscribeMessage,
			WebSocketGateway,
			WebSocketServer,
			WsResponse,
			MessageBody,
			ConnectedSocket }
from '@nestjs/websockets';
import { Server, Socket } from 'ws';

interface Player {
	socket: Socket;
	name: string;
	ID: number;
	//playerIDs??
}

interface Match {
	player1: Player;
	player2: Player;
}

@WebSocketGateway(5174, {cors: {origin: '*', methods: ['GET', 'POST']}})
export class GameserverGateway {
	@WebSocketServer()
	server: Server;

	private queue: Player[] = [];
	private ongoingMatches: Match[] = [];
	private disconnectMsg = {
		event: "opponentDisconnect"
	};

	handleConnection(client: Socket) {
		console.log('New player connected');
	}
	
	handleDisconnect(client: Socket) {
		this.queue.forEach((player, i) => {
			if (player.socket === client) {
				this.queue.splice(i, 1);
				return;
			}
		});
		
		this.ongoingMatches.forEach((match, i) => {
			if (match.player1.socket === client) {
				match.player2.socket.send(JSON.stringify(this.disconnectMsg));
				match.player2.socket.close();
				return;
			}
			else if (match.player2.socket === client) {
				match.player1.socket.send(JSON.stringify(this.disconnectMsg));
				match.player1.socket.close();
				return;
			}
		});
	}

	handleError(client: Socket, ...args: any[]) {
		console.error(args);
	}
	
	@SubscribeMessage('authenticate')
	authenticatePlayer(client: Socket,
		message: {
			name: string
			ID: number }) {
		//this.server.to(message.room).emit('chatToClient', message);
		const newPlayer: Player = {
			socket: client,
			name: message.name,
			ID: message.ID
		}
		if (this.queue.length > 0) {
			const opponent = this.queue.splice(0, 1);
			this.initGame(opponent[0], newPlayer);
		}
		else {
			this.queue.push(newPlayer);
			console.log("Player " + newPlayer.name + " added to queue!");
		}
	}

	initGame(player1: Player, player2: Player) {
		const newMatch: Match = {
			player1: player1,
			player2: player2
		};
		this.ongoingMatches.push(newMatch);
		console.log("Match made! " + newMatch.player1.name + " will play against " + newMatch.player2.name);
		// HERE -> send names to other players & do game stuff :[
		// Step by step move things from clients to server to see if it works.
		// look at startGame & startQueue to follow the logic
	};
}
