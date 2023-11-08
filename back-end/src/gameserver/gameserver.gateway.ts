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
}

class Match {
	player1: Player;
	player2: Player;

		//HERE -> implementation
	sendToBoth(msg: any) {
		console.log(msg);
		this.player1.socket.send(JSON.stringify(msg));
		this.player2.socket.send(JSON.stringify(msg));
	}
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
	private gameInfoMsg = {
		event: "gameInfo",
		data: {
			opponentName: ''
		}
	};
	private countdownMsg = {
		event: "countdown",
		data: { number: 0 }
	}
	private startGameMsg = {
		event: "startGame",
	}

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
		console.log('Player disconnected');
	}

	handleError(client: Socket, ...args: any[]) {
		console.error(args);
	}
	
	@SubscribeMessage('authenticate')
	authenticatePlayer(client: Socket,
		message: {
			name: string
			ID: number }) {
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
			player2: player2,
		};

		this.ongoingMatches.push(newMatch);
		console.log("Match made! " + player1.name + " will play against " + player2.name);

		this.gameInfoMsg.data.opponentName = player1.name;
		player2.socket.send(JSON.stringify(this.gameInfoMsg));
		this.gameInfoMsg.data.opponentName = player2.name;
		player1.socket.send(JSON.stringify(this.gameInfoMsg));
		this.doCountdown(newMatch);
		// HERE
		// Step by step move things from clients to server to see if it works.
		// look at startGame to follow the logic
	};

	doCountdown(match: Match) {
		this.countdownMsg.data.number = 3;
		this.sendToBoth(JSON.stringify(this.countdownMsg), match);
		setTimeout(() => {
			this.countdownMsg.data.number--;
			this.sendToBoth(JSON.stringify(this.countdownMsg), match);
		}, 2000);
		setTimeout(() => {
			this.countdownMsg.data.number--;
			this.sendToBoth(JSON.stringify(this.countdownMsg), match);
		}, 3000);
		setTimeout(() => 
			this.sendToBoth(JSON.stringify(this.startGameMsg), match)
		, 4000);
	};
}
