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

	/*	Game variables
		Careful when changing, they might have equivalents in Game.vue that need to be the same */
	player1Score =	0;
	player2Score =	0;
	pointsToWin =	6;

	framesPerSecond =	50;
	baseBallSpeed =		8;

	gameWidth =			1000;
	gameHeight =		800;

	interval: any;

	ball = {
		x:			this.gameWidth/2,
		y:			this.gameHeight/2,
		radius:		8,
		speed:		0,
		velocityX:	0,
		velocityY:	0
	}
	paddleWidth =	12;
	paddleHeight =	85;
	paddles = {
		player1: {
			startX:	30,
			startY:	this.gameHeight/2 - this.paddleHeight/2
		},
		player2: {
			startX:	this.gameWidth - 30 - this.paddleWidth,
			startY:	this.gameHeight/2 - this.paddleHeight/2
		}
	};
	PLAYER1 =	1;
	PLAYER2 =	-1;

	PLAYER1_WIN	= 0;
	PLAYER2_WIN	= 1;
	DISCONNECT	= 2;
	gameEnded = false;
	
	constructor(player1: Player, player2: Player){
		this.player1 = player1;
		this.player2 = player2;
	}
	sendToBoth(msg: any) {
		this.player1.socket.send(JSON.stringify(msg));
		this.player2.socket.send(JSON.stringify(msg));
	}
	sendToPlayer1(msg: any) {
		this.player1.socket.send(JSON.stringify(msg));
	}
	sendToPlayer2(msg: any) {
		this.player2.socket.send(JSON.stringify(msg));
	}
}

@WebSocketGateway(5174, {cors: {origin: '*', methods: ['GET', 'POST']}})
export class GameserverGateway {
	@WebSocketServer()
	server: Server;

	/* This is where we save the players */
	private queue: Player[] = [];
	private ongoingMatches: Match[] = [];

	/*	Message objects
		SHOULD ONLY BE USED AS TEMPLATES, NOT ACTUALLY USED
		if you use them, they might change value since they will be simultaneously used by another running function */
	private disconnectMsg = {
		event: "opponentDisconnect"
	};
	private gameInfoMsg = {
		event: "gameInfo",
		data: {
			opponentName: '',
			opponentID: 0
		}
	};
	private countdownMsg = {
		event: "countdown",
		data: { number: 0 }
	};
	private startGameMsg = {
		event: "startGame",
		data: {
			ball: {
				speed:		0,
				velocityX:	0,
				velocityY:	0
			}
		}
	};
	private updateMsg = {
		event: "update",
		data: {
			ball: {
				x:			0,
				y:			0,
				speed:		0,
				velocityX:	0,
				velocityY:	0
			}
		}
	};
	private updateScoreMsg = {
		event: "updateScore",
		data: {
			playerScore: 0,
			opponentScore: 0
		}
	}
	private moveOppponentPaddleMsg = {
		event: "moveOpponentPaddle",
        data: {
			paddle: {
				startY: 0
			}
        }
    };
	private gameEndMsg = {
		event: "gameEnd",
		data: {
			won: false
		}
	};
	private onlyOneGamePerPlayerMsg = {
		event: "onlyOneGamePerPlayer",
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
			if (match.player1.socket === client && !match.gameEnded) {
				match.player2.socket.send(JSON.stringify(this.disconnectMsg));
				match.player2.socket.close();
				this.gameEnd(match, match.DISCONNECT);
				return;
			}
			else if (match.player2.socket === client && !match.gameEnded) {
				match.player1.socket.send(JSON.stringify(this.disconnectMsg));
				match.player1.socket.close();
				this.gameEnd(match, match.DISCONNECT);
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
		if (this.isPlayerAlreadyPlaying(message.ID)) {
			client.send(JSON.stringify(this.onlyOneGamePerPlayerMsg));
			return;
		}
		
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
	@SubscribeMessage('movePaddle')
	movePaddle(client: Socket, message: { paddle: { startY: number }}) {
		this.ongoingMatches.forEach((match, i) => {
			if (match.player1.socket === client) {
				match.paddles.player1.startY = message.paddle.startY;


				let moveOppponentPaddleMsg = JSON.parse(JSON.stringify(this.moveOppponentPaddleMsg));
				moveOppponentPaddleMsg.data.paddle.startY = message.paddle.startY;

				match.sendToPlayer2(moveOppponentPaddleMsg);
				return;
			}
			else if (match.player2.socket === client) {
				match.paddles.player2.startY = message.paddle.startY;

				let moveOppponentPaddleMsg = JSON.parse(JSON.stringify(this.moveOppponentPaddleMsg));
				moveOppponentPaddleMsg.data.paddle.startY = message.paddle.startY;

				match.sendToPlayer1(moveOppponentPaddleMsg);
				return;
			}
		});
	}

	initGame(player1: Player, player2: Player) {
		const newMatch = new Match(player1, player2);

		this.ongoingMatches.push(newMatch);
		console.log("Match made! " + player1.name + " will play against " + player2.name);

		let gameInfoMsg = JSON.parse(JSON.stringify(this.gameInfoMsg));
		gameInfoMsg.data.opponentName = player1.name;
		gameInfoMsg.data.opponentID = player1.ID;
		newMatch.sendToPlayer2(gameInfoMsg);
		gameInfoMsg.data.opponentName = player2.name;
		gameInfoMsg.data.opponentID = player2.ID;
		newMatch.sendToPlayer1(gameInfoMsg);
		this.doCountdown(newMatch);
	};

	doCountdown(match: Match) {
		let countdownMsg = JSON.parse(JSON.stringify(this.countdownMsg)); 
		countdownMsg.data.number = 3;
		match.sendToBoth(countdownMsg);
		setTimeout(() => {
			countdownMsg.data.number--;
			match.sendToBoth(countdownMsg);
		}, 2000);
		setTimeout(() => {
			countdownMsg.data.number--;
			match.sendToBoth(countdownMsg);
		}, 3000);
		setTimeout(() => 
			this.startGame(match)
		, 4000);
	};

	/* Game functions */
	startGame(match: Match) {
		this.initBallDirection(match);

		let startGameMsg1 = JSON.parse(JSON.stringify(this.startGameMsg));
		startGameMsg1.data.ball.speed = match.ball.speed;
		startGameMsg1.data.ball.velocityX = match.ball.velocityX;
		startGameMsg1.data.ball.velocityY = match.ball.velocityY;
		
		let startGameMsg2 = JSON.parse(JSON.stringify(startGameMsg1));
		startGameMsg2.data.ball.velocityX = match.ball.velocityX *-1;

		setTimeout(() => {
			match.sendToPlayer1(startGameMsg1);
			match.sendToPlayer2(startGameMsg2);
			match.interval = setInterval(() => this.game(match), 1000/match.framesPerSecond);
		}, 1000);
	}

	game(match: Match) {
		this.updatePositions(match);
		this.sendUpdate(match);
	};

	sendUpdate(match: Match) {
		let	updateMsg1 = JSON.parse(JSON.stringify(this.updateMsg));
		updateMsg1.data.ball.x = match.ball.x;
		updateMsg1.data.ball.y = match.ball.y;
		updateMsg1.data.ball.speed = match.ball.speed;
		updateMsg1.data.ball.velocityX = match.ball.velocityX;
		updateMsg1.data.ball.velocityY = match.ball.velocityY;
		
		let updateMsg2 = JSON.parse(JSON.stringify(updateMsg1));
		updateMsg2.data.ball.x = match.gameWidth - match.ball.x;
		updateMsg2.data.ball.velocityX = match.ball.velocityX *-1;
		
		match.sendToPlayer1(updateMsg1);
		match.sendToPlayer2(updateMsg2);
	};

	updatePositions(match: Match) {
		match.ball.x += match.ball.velocityX;
		match.ball.y += match.ball.velocityY;
		if (this.ballHitTopOrBottom(match))
			match.ball.velocityY *= -1;
		else if (this.ballHitPaddle(match, match.paddles.player1))
			this.calculateNewBallDirection(match, match.paddles.player1, match.PLAYER1);
		else if (this.ballHitPaddle(match, match.paddles.player2))
			this.calculateNewBallDirection(match, match.paddles.player2, match.PLAYER2);
		else if (this.ballHitLeft(match)) {
			match.player2Score++;
			this.sendNewScore(match);
			if (match.player2Score >= match.pointsToWin)
				this.gameEnd(match, match.PLAYER2_WIN);
			this.resetBall(match);
			setTimeout(() => this.initBallDirection(match), 1000);
		}
		else if (this.ballHitRight(match)) {
			match.player1Score++;
			this.sendNewScore(match);
			if (match.player1Score >= match.pointsToWin)
				this.gameEnd(match, match.PLAYER1_WIN);
			this.resetBall(match);
			setTimeout(() => this.initBallDirection(match), 1000);
		}
	}

	async gameEnd(match: Match, result: number) {
		match.gameEnded = true;
		
		const clearIntervalPromise = new Promise<void>((resolve) => {
			setTimeout(() => {
				clearInterval(match.interval);
				resolve();
			}, 0); /* 0 milliseconds delay, executes on the next tick */
		});
		
		await clearIntervalPromise;
		
		this.ongoingMatches.forEach((matchI, i) => {
			if (matchI === match)
			match = this.ongoingMatches.splice(i, 1)[0];
		});

		if (result == match.DISCONNECT)
			return;
	
		let gameEndMsg1 = JSON.parse(JSON.stringify(this.gameEndMsg));
		let gameEndMsg2 = JSON.parse(JSON.stringify(this.gameEndMsg));
		
		switch (result) {
			case match.PLAYER1_WIN:
				gameEndMsg1.data.won = true;
				gameEndMsg2.data.won = false;
				break;
			case match.PLAYER2_WIN:
				gameEndMsg1.data.won = false;
				gameEndMsg2.data.won = true;
				break;
		}

		match.sendToPlayer1(gameEndMsg1);
		match.sendToPlayer2(gameEndMsg2);
		
		const databaseMatch = {
			player1Score: match.player1Score,
			player2Score: match.player2Score,
			player1: match.player1.ID,
			player2: match.player2.ID,
			winner: (result == match.PLAYER1_WIN) ? match.player1.ID : match.player2.ID,
			loser: (result == match.PLAYER1_WIN) ? match.player2.ID : match.player1.ID
		};
		fetch('http://localhost:3000/match', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(databaseMatch)
		})
		 .then(response => response.json())
		 .then(data => console.log(data))
		 .catch(error => console.error('Error:', error));
	}

	sendNewScore(match: Match) {
		let updateScoreMsg1 = JSON.parse(JSON.stringify(this.updateScoreMsg));
		let updateScoreMsg2 = JSON.parse(JSON.stringify(this.updateScoreMsg));
	
		updateScoreMsg1.data.playerScore = match.player1Score;
		updateScoreMsg1.data.opponentScore = match.player2Score;
		updateScoreMsg2.data.playerScore = match.player2Score;
		updateScoreMsg2.data.opponentScore = match.player1Score;
		
		match.sendToPlayer1(updateScoreMsg1);
		match.sendToPlayer2(updateScoreMsg2);
		this.ongoingMatches.find(i => i === match);

	}

	initBallDirection(match: Match) {
		var random = Math.floor(Math.random() * 4);
		switch (random) {
			case 0:
				match.ball.velocityX = match.baseBallSpeed*-1;
				match.ball.velocityY = match.baseBallSpeed*-1;
				break;
			case 1:
				match.ball.velocityX = match.baseBallSpeed*-1;
				match.ball.velocityY = match.baseBallSpeed;
				break;
			case 2:
				match.ball.velocityX = match.baseBallSpeed;
				match.ball.velocityY = match.baseBallSpeed*-1;
				break;
			case 3:
				match.ball.velocityX = match.baseBallSpeed;
				match.ball.velocityY = match.baseBallSpeed;
				break;
		}
		match.ball.speed = Math.sqrt(match.ball.velocityX ** 2 + match.ball.velocityY ** 2);
	};

	resetBall(match: Match): void {
		match.ball.x = match.gameWidth / 2;
		match.ball.y = match.gameHeight / 2;
		match.ball.velocityX = 0;
		match.ball.velocityY = 0;
	};
	
	ballHitTopOrBottom(match: Match): boolean {
		if (match.ball.y + match.ball.radius > match.gameHeight ||
			match.ball.y - match.ball.radius < 0)
			return true;
		return false;
	};
	
	ballHitLeft(match: Match): boolean {
		if (match.ball.x - match.ball.radius < 0)
			return true;
		return false;
	};
	
	ballHitRight(match: Match): boolean {
		if (match.ball.x + match.ball.radius > match.gameWidth)
			return true;
		return false;
	};
	
	ballHitPaddle(match: Match, paddle: any): boolean {
		if (match.ball.x - match.ball.radius < paddle.startX + match.paddleWidth
			&& match.ball.y + match.ball.radius > paddle.startY
			&& match.ball.y - match.ball.radius <  paddle.startY + match.paddleHeight
			&& match.ball.x + match.ball.radius > paddle.startX)
			return true;
		return false;
	};
	
	calculateNewBallDirection(match: Match, hitPaddle: any, direction: number): void {
		var collidePoint = match.ball.y - (hitPaddle.startY + match.paddleHeight/2);
		
		/* normalization */
		collidePoint = collidePoint / (match.paddleHeight/2);
		/* calculate angle in radian */
		var angleRad = collidePoint * Math.PI/4;
	
		/* increase ball speed with every paddle hit */
		match.ball.speed += 0.7;
	
		match.ball.velocityX = direction *	match.ball.speed * Math.cos(angleRad);
		match.ball.velocityY = 				match.ball.speed * Math.sin(angleRad);
	};

	isPlayerAlreadyPlaying(playerID: number) {
		if (this.queue.some(player => player.ID === playerID)) {
			return true;
		  }
		
		  if (this.ongoingMatches.some(match =>
				match.player1.ID === playerID
			||	match.player2.ID === playerID)) {
			return true;
		  }

		return false;
	}

}
