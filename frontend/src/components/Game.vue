<template>
	<div class="stupid-container" :style="{ 'width': gameWidth + 'px', 'height': gameHeight + 'px' }">
		<button v-if="gameState != PLAYING && !notYet" @click="connectToServer" :disabled="gameState === WAITING" class="playButton">
			{{ buttonText }}
		</button>
		<canvas id="gameCanvas" :width="gameWidth" :height="gameHeight"></canvas>
	</div>
	<p>{{ opponentMsg }}</p>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import fontUrl from '/fonts/Pixeled.ttf';

let canvasFont: FontFace;

//const	NARROW = true;
//const	WIDE = false;
//let		gameView = WIDE;

function calculateGameSize(): number {
	var gameSize: number;
	
	if (window.innerWidth < 992) {
		gameSize = 0.00095 * window.innerWidth;
		//gameView = NARROW;
	}
	else {
		gameSize = 0.0006 * window.innerWidth;
		//gameView = WIDE;
	}

	return (gameSize);
};

let		gameSize = calculateGameSize();

let		playerScore =	0;
let		opponentScore =	0;
const	pointsToWin =	11;

let		framesPerSecond =	50;
const	baseBallSpeed =		8;

let		backgroundColor =	"white";
let		elementColor =		"black";

let		interval: number;
let		context: CanvasRenderingContext2D;
let		canvas: HTMLCanvasElement;

const	PLAYER =	1;
const	OPPONENT =	-1;

const	BEFORE_GAME =		0;
const	WAITING =			1;
const	PLAYING = 			2;
const	GAME_END =			3;
let		notYet =					ref(false);
let		gameState: Ref<number> =	ref(BEFORE_GAME);

const	WON =			0;
const	LOST =			1;
const	DISCONNECT =	2;
let		gameResult =	WON;

let		buttonText =				ref("play");
let		opponentMsg =				ref("no game active");

let	gameWidth =		ref(1000	*gameSize);
let	gameHeight =	ref(800		*gameSize);
let	fontSize =		50			*gameSize;
let paddleWidth =	12			*gameSize;
let paddleHeight =	85			*gameSize;

const net = {
	width:	3	*gameSize,
	height:	15	*gameSize,
	gaps:	10	*gameSize
};

const paddles = {
	player: {
		startX:	30 * gameSize,
		startY:	gameHeight.value/2 - paddleHeight/2
	},
	opponent: {
		startX:	gameWidth.value - (30 * gameSize) - paddleWidth,
		startY:	gameHeight.value/2 - paddleHeight/2
	}
};

const ball = {
	x:			gameWidth.value/2,
	y:			gameHeight.value/2,
	radius:		8	*gameSize,
	speed:		0	*gameSize,
	velocityX:	0	*gameSize,
	velocityY:	0	*gameSize
};

interface Message {
	type: string,
	data: { }
};
const	playerName = "ANITA_" + Math.round(Math.random()*100);
const	playerID = Math.round(Math.random()*10);
let		webSocket: WebSocket;

function atWindowResize(timeout = 300){
	let timer: number;
	return () => {
		clearTimeout(timer);
		timer = window.setTimeout(() => resizeCanvas(), timeout);
	};
};
function resizeCanvas() {
	const oldGameSize =	gameSize;
	gameSize =				calculateGameSize();
	resizeEverything(gameSize, oldGameSize);
	requestAnimationFrame(renderElements);
	requestAnimationFrame(adjustCanvas);
};
function resizeEverything(newGameSize: number, oldGameSize: number) {
	/* 	console.log("resizeEverything()");
 */	var changeFactor = newGameSize / oldGameSize;

	gameWidth.value *=	changeFactor;
	gameHeight.value *=	changeFactor;
	fontSize *=			changeFactor;
	paddleWidth *=		changeFactor;
	paddleHeight *=		changeFactor;

	net.width *=	changeFactor;
	net.height *=	changeFactor;
	net.gaps *=		changeFactor;

	paddles.player.startX *=	changeFactor;
	paddles.player.startY *=	changeFactor;
	paddles.opponent.startX *=	changeFactor;
	paddles.opponent.startY *=	changeFactor;

	ball.x *=		changeFactor;
	ball.y *=		changeFactor;
	ball.radius *=	changeFactor;

	ball.speed *=		changeFactor;
	ball.velocityX *=	changeFactor;
	ball.velocityY *=	changeFactor;
};
/* when the canvas height doesn't fit into screen despite adjustments */
function adjustCanvas() {
	if (/* gameView == WIDE &&  */canvas.getBoundingClientRect().bottom > window.innerHeight) {
		var oldGameSize = gameSize;
		gameSize = 0.0008 * window.innerHeight;
		resizeEverything(gameSize, oldGameSize);
		requestAnimationFrame(renderElements);
		return;
	}
	/* if (gameView == NARROW && canvas.getBoundingClientRect().bottom > (window.innerHeight * 0.5)) {
		var oldGameSize = gameSize;
		gameSize = 0.0006 * window.innerHeight;
		resizeEverything(gameSize, oldGameSize);
		requestAnimationFrame(renderElements);
		return;
	} */
};

onMounted(() => {
	canvasFont = new FontFace('canvasFont', `url(${fontUrl})`);

	canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
	context = canvas.getContext("2d") as CanvasRenderingContext2D;
	
	canvasFont.load().then((font) => {
		document.fonts.add(font);

		renderElements();
		adjustCanvas();
		window.addEventListener("resize", atWindowResize());
	});
});

/* functions */

function connectToServer(): void {
	
	gameState.value = WAITING;
	buttonText.value = "Connecting to server...";
	try {
		webSocket = new WebSocket("ws://10.13.3.7:5174");
		
		webSocket.addEventListener('open', (event) => {
			const authMsg = {
				event: 'authenticate',
                data: {
					name: playerName, /////// neeed client name!!!!!
					ID: playerID /////// neeed client name!!!!!
                }
            };
            webSocket.send(JSON.stringify(authMsg));
			buttonText.value = "Waiting for opponent...";
        });

		webSocket.addEventListener('message', handleMessages);

		webSocket.addEventListener('close', (event) => {
			if (gameState.value != GAME_END)
				handleDisconnect();
		});
		webSocket.addEventListener('error', (event) => {
			console.error(event);
		});
	}
	catch(error) {
		console.error(error);
	}
};

function handleMessages(event: MessageEvent<any>) {
	const message = JSON.parse(event.data);
	console.log(message);

	switch (message.event) {
		case 'opponentDisconnect':
			handleDisconnect();
			break;

		case 'gameInfo':
			opponentMsg.value = "Opponent: " + message.data.opponentName;
			resetGame();
			renderElements();
			break;

		case 'countdown':
			buttonText.value = message.data.number.toString();
			break;

		case 'startGame':
			ball.speed =		message.data.ball.speed		*gameSize;
			ball.velocityX =	message.data.ball.velocityX	*gameSize;
			ball.velocityY =	message.data.ball.velocityY	*gameSize;
			startGame();
			break;

		case 'update':
			ball.x =			message.data.ball.x			*gameSize;
			ball.y =			message.data.ball.y			*gameSize;
			ball.speed =		message.data.ball.speed		*gameSize;
			ball.velocityX =	message.data.ball.velocityX	*gameSize;
			ball.velocityY =	message.data.ball.velocityY	*gameSize;
			break;

		case 'moveOpponentPaddle':
			paddles.opponent.startY = message.data.paddle.startY * gameSize;
			break;

		case 'updateScore':
			playerScore = message.data.playerScore;
			opponentScore = message.data.opponentScore;
			break;
		
		case 'gameEnd':
			gameResult = message.data.won ? WON : LOST;
			gameEnd();
			break;
	}
};

function handleDisconnect(): void {
	gameResult = DISCONNECT;
	gameEnd();
};

function startGame(): void {
	// HERE -> switch this to server. maybe look at that game tutorial for how to do these events
	gameState.value = PLAYING;
	canvas.addEventListener("mousemove", movePaddle);
	interval = window.setInterval(game, 1000/framesPerSecond);
};

function game(): void {
	updatePositions();
	renderElements();
};

function updatePositions(): void {
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;

	// else if (ballHitLeft()) {
	// 	opponentScore++;
	// 	if (opponentScore >= pointsToWin) {
	// 		gameResult = LOST;
	// 		gameEnd();
	// 	}
	// 	resetBall();
	// }
	// else if (ballHitRight()) {
	// 	playerScore++;
	// 	if (playerScore >= pointsToWin) {
	// 		gameResult = WON;
	// 		gameEnd();
	// 	}
	// 	resetBall();
	// }
};

function renderElements(): void {
/* 	console.log("renderElements()");
 */	context.clearRect(0, 0, canvas.width, canvas.height);
	drawRectangle(0, 0, gameWidth.value, gameHeight.value, backgroundColor);
	drawBall();
	drawPaddles();
	drawNet();
	drawScore();
	if (gameState.value == GAME_END)
		drawEndMessage();
};

function movePaddle(this: HTMLCanvasElement, event: MouseEvent): void {
	let mouse = this.getBoundingClientRect();
	if (event.clientY - mouse.top - paddleHeight/2 < 0)
		paddles.player.startY = 0;
	else if (event.clientY - mouse.top + paddleHeight/2 >= gameHeight.value)
		paddles.player.startY = gameHeight.value - paddleHeight;
	else
		paddles.player.startY = event.clientY - mouse.top - paddleHeight/2;

	const movePaddleMsg = {
		event: 'movePaddle',
        data: {
			paddle: {
				startY: paddles.player.startY / gameSize
			}
        }
    };
    webSocket.send(JSON.stringify(movePaddleMsg));
};

async function gameEnd(): Promise<void> {
	const clearIntervalPromise = new Promise<void>((resolve) => {
		setTimeout(() => {
			clearInterval(interval);
			resolve();
		}, 0); /* 0 milliseconds delay, executes on the next tick */
	});

	await clearIntervalPromise;
	notYet.value = true;
	gameState.value = GAME_END;

	webSocket.close();
	
	elementColor = "white";
	backgroundColor = "black";
	ball.x = -10 * gameSize;
	ball.y = -10 * gameSize;
	renderElements();
	
	setTimeout(() => {
		notYet.value = false;
		buttonText.value = "play";
		opponentMsg.value = "No game active";
	}, 2500);
};

function resetGame(): void {
	backgroundColor = "white";
	elementColor = "black";
	paddles.player.startY = gameHeight.value/2 - paddleHeight/2;
	playerScore = 0;
	paddles.opponent.startY = gameHeight.value/2 - paddleHeight/2;
	opponentScore = 0;
	ball.x = gameWidth.value/2;
	ball.y = gameHeight.value/2;
	ball.velocityX = 0;
	ball.velocityY = 0;
	ball.speed = 0;
};

function drawRectangle(startX: number, startY: number, lengthX: number, lengthY: number, color: string): void {
/* 	console.log("drawRectangle()"); */
	context.fillStyle = color;
	context.fillRect(startX, startY, lengthX, lengthY);
};

function drawBall(): void {
/* 	console.log("drawBall()");
 */	context.fillStyle = elementColor;
	context.beginPath();
	context.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2, false);
	context.closePath();
	context.fill();
};

function drawPaddles(): void {
/* 	console.log("drawPaddles()");
 */	drawRectangle(paddles.player.startX, paddles.player.startY, paddleWidth, paddleHeight, elementColor);
	drawRectangle(paddles.opponent.startX, paddles.opponent.startY, paddleWidth, paddleHeight, elementColor);
};

function drawNet(): void {
/* 	console.log("drawNet()");
 */	for(let i = 5; i <= gameHeight.value; i += (net.gaps + net.height)) {
		drawRectangle((gameWidth.value/2 - net.width/2), i, net.width, net.height, elementColor);
	}
};

function drawScore(): void {
	drawText(playerScore.toString(), gameWidth.value/4, gameHeight.value/6);
	drawText(opponentScore.toString(), 3*gameWidth.value/4, gameHeight.value/6);
};

function drawEndMessage(): void {
	var message: string;
	switch (gameResult) {
		case WON:
			message = "YOU HAVE WON!"; break;
		case LOST:
			message = "YOU HAVE LOST :("; break;
		case DISCONNECT:
			message = "connection error:"; break;
		default:
			message = "???";
	}

	drawText(message, gameWidth.value/2, gameHeight.value/2);
	if (gameResult === DISCONNECT) {
		drawText("game terminated", gameWidth.value/2, (gameHeight.value/2) + (100*gameSize));
	}
};

function drawText(text: string, xOffset: number, yOffset: number): void {
	context.textAlign = 'center';
	context.fillStyle = elementColor;
	context.font = fontSize.toString() + `px ${canvasFont.family}`;
	context.fillText(text, xOffset, yOffset);
};

function resetBall(): void {
/* 	console.log("resetBall()");
 */	ball.x = gameWidth.value / 2;
	ball.y = gameHeight.value / 2;
	ball.velocityX = 0;
	ball.velocityY = 0;
};

</script>

<style scoped>
canvas {
	z-index: 1;
	image-rendering: pixelated;
	display: block;
	margin: auto;
	margin-top: 30vh;
}

.playButton {
	padding: 30px;
	z-index: 0;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	align-items: center;
}

.stupid-container {
	position: relative;
	width: 100%;
	height: 100%;
}

</style>