<template>
	<div class="stupid-container" :style="{ 'width': gameWidth + 'px', 'height': gameHeight + 'px' }">
		<button v-if="gameState != PLAYING && !notYet" @click="initWebsocket" :disabled="gameState === WAITING_IN_QUEUE" class="playButton">
			{{ buttonText }}
		</button>
		<canvas id="gameCanvas" :width="gameWidth" :height="gameHeight"></canvas>
	</div>
	<p>{{ opponentMsg }}</p>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';

interface Message {
    type: string,
    data: {
	
	}
};

const	playerName = "ANITA_" + Math.round(Math.random()*100);
const	playerID = Math.round(Math.random()*10);

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

const	framesPerSecond =	50;
const	baseBallSpeed =		8;

let		backgroundColor =	"white";
let		elementColor =		"black";

let		interval: number;
let		context: CanvasRenderingContext2D;
let		canvas: HTMLCanvasElement;

const	PLAYER =	1;
const	OPPONENT =	-1;

const	BEFORE_GAME =		0;
const	WAITING_IN_QUEUE =	1;
const	PLAYING = 			2;
const	GAME_END =			3;
let		notYet =			ref(false);

const	WON =			0;
const	LOST =			1;
const	DISCONNECT =	2;
let		gameResult =	WON;

let		gameState: Ref<number> =	ref(BEFORE_GAME);
let		buttonText =				ref("play");
let		opponentMsg =				ref("no game started yet");

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

let webSocket: WebSocket;

function atWindowResize(timeout = 300){
/* 	console.log("atWindowResize()");
 */	let timer: number;
	return () => {
	  clearTimeout(timer);
	  timer = setTimeout(() => resizeCanvas(), timeout);
	};
};
function resizeCanvas() {
	/* 	console.log("resizeCanvas()");
	*/const oldGameSize =	gameSize;
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
/* 	console.log("onMounted()");
 */	canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
	context = canvas.getContext("2d") as CanvasRenderingContext2D;
	renderElements();
	adjustCanvas();

	window.addEventListener("resize", atWindowResize());
});

/* functions */

function startQueue() {
/*	console.log("startQueue()");*/
	initWebsocket();
	//HERE

	buttonText.value = "Waiting for opponent...";
	gameState.value = WAITING_IN_QUEUE;
	setTimeout(() => {
		buttonText.value = "3";
		resetGame();
		renderElements();
	}, 1000);
	setTimeout(() => buttonText.value = "2", 2000);
	setTimeout(() => buttonText.value = "1", 3000);
	setTimeout(() => startGame(), 4000);
}

function initWebsocket(): void {
	try {
		webSocket = new WebSocket("ws://localhost:5174");

		webSocket.addEventListener('open', (event) => {
            const authMsg = {
                event: 'authenticate',
                data: {
					name: playerName, /////// neeed client name!!!!!
					ID: playerID /////// neeed client name!!!!!
                }
            };
            webSocket.send(JSON.stringify(authMsg));
        });

		webSocket.addEventListener('message', (event) => {
			const message = JSON.parse(event.data);
	        switch (message.event) {
				case 'opponentDisconnect':
					handleOpponentDisconnect();
					break;
			}
	    });

		webSocket.addEventListener('close', (event) => {
			//HERE
		});
		webSocket.addEventListener('error', (event) => {
			//HERE
		});
	}
	catch(error) {
		console.error(error);
	}
};

function handleOpponentDisconnect(): void {
	gameResult = DISCONNECT;
	gameEnd();
	//HERE -> is that all we need to do?
};

function startGame(): void {
/* 	console.log("startGame()");
 */	gameState.value = PLAYING;
	canvas.addEventListener("mousemove", movePaddle);
	initBallDirection();
	setTimeout(() => {
		interval = setInterval(game, 1000/framesPerSecond);
	}, 1000);
};

function game(): void {
/* 	console.log("game()");
 */	updatePositions();
	renderElements();
};

function updatePositions(): void {
/* 	console.log("updatePositions()");
 */	ball.x += ball.velocityX;
	ball.y += ball.velocityY;

	if (ballHitTopOrBottom())
		ball.velocityY *= -1;
	else if (ballHitPlayerPaddle())
		calculateNewBallDirection(paddles.player, PLAYER);
	else if (ballHitOpponentPaddle())
		calculateNewBallDirection(paddles.opponent, OPPONENT);
	else if (ballHitLeft()) {
		opponentScore++;
		if (opponentScore >= pointsToWin) {
			gameResult = LOST;
			gameEnd();
		}
		resetBall();
		setTimeout(() => initBallDirection(), 1000);
	}
	else if (ballHitRight()) {
		playerScore++;
		if (playerScore >= pointsToWin) {
			gameResult = WON;
			gameEnd();
		}
		resetBall();
		setTimeout(() => initBallDirection(), 1000);
	}
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
/* 	console.log("movePaddle()");
 */	let mouse = this.getBoundingClientRect();

	if (event.clientX < gameWidth.value/2)
		var currentlyPlaying = paddles.player;
	else
		var currentlyPlaying = paddles.opponent;

	if (event.clientY - mouse.top - paddleHeight/2 < 0)
		currentlyPlaying.startY = 0;
	else if (event.clientY - mouse.top + paddleHeight/2 >= gameHeight.value)
		currentlyPlaying.startY = gameHeight.value - paddleHeight;
	else
		currentlyPlaying.startY = event.clientY - mouse.top - paddleHeight/2;
};

async function gameEnd(): Promise<void> {
/* 	console.log("gameEnd()")
 */	resetBall();
		
	const clearIntervalPromise = new Promise<void>((resolve) => {
		setTimeout(() => {
			clearInterval(interval);
			resolve();
		}, 0); // 0 milliseconds delay, executes on the next tick
	});

	await clearIntervalPromise;
	notYet.value = true;
	gameState.value = GAME_END;
	
	elementColor = "white";
	backgroundColor = "black";
	ball.x = -10 * gameSize;
	ball.y = -10 * gameSize;
	renderElements();
	// send data to database n shit
	
	setTimeout(() => {
		notYet.value = false;
		buttonText.value = "play";
	}, 2500);
};

function resetGame(): void {
/* 	console.log("resetGame()");
 */	backgroundColor = "white";
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

function initBallDirection(): void {
/* 	console.log("initBallDirection()");
 */	var random = Math.floor(Math.random() * 4);
	switch (random) {
		case 0:
			ball.velocityX = baseBallSpeed*gameSize*-1;
			ball.velocityY = baseBallSpeed*gameSize*-1;
			break;
		case 1:
			ball.velocityX = baseBallSpeed*gameSize*-1;
			ball.velocityY = baseBallSpeed*gameSize;
			break;
		case 2:
			ball.velocityX = baseBallSpeed*gameSize;
			ball.velocityY = baseBallSpeed*gameSize*-1;
			break;
		case 3:
			ball.velocityX = baseBallSpeed*gameSize;
			ball.velocityY = baseBallSpeed*gameSize;
			break;
	}
	ball.speed = Math.sqrt(ball.velocityX ** 2 + ball.velocityY ** 2);
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
/* 	console.log("drawScore()");
 */	
	drawText(playerScore.toString(), gameWidth.value/4, gameHeight.value/6);
	drawText(opponentScore.toString(), 3*gameWidth.value/4, gameHeight.value/6);
};

function drawEndMessage(): void {
	var message: string;
	gameResult = DISCONNECT;
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
	context.font = fontSize.toString() + "px textfont";
	context.fillText(text, xOffset, yOffset);
};

function resetBall(): void {
/* 	console.log("resetBall()");
 */	ball.x = gameWidth.value / 2;
	ball.y = gameHeight.value / 2;
	ball.velocityX = 0;
	ball.velocityY = 0;
};

function ballHitTopOrBottom(): boolean {
	if (ball.y + ball.radius > gameHeight.value ||
		ball.y - ball.radius < 0)
		return true;
	return false;
};

function ballHitLeft(): boolean {
	if (ball.x - ball.radius < 0)
		return true;
	return false;
};

function ballHitRight(): boolean {
	if (ball.x + ball.radius > gameWidth.value)
		return true;
	return false;
};

function ballHitPlayerPaddle(): boolean {
	if (ball.x - ball.radius < paddles.player.startX + paddleWidth
		&& ball.y + ball.radius > paddles.player.startY
		&& ball.y - ball.radius <  paddles.player.startY + paddleHeight
		&& ball.x + ball.radius > paddles.player.startX)
		return true;
	return false;
};

function ballHitOpponentPaddle(): boolean {
	if (ball.x - ball.radius < paddles.opponent.startX + paddleWidth
		&& ball.y + ball.radius > paddles.opponent.startY
		&& ball.y - ball.radius <  paddles.opponent.startY + paddleHeight
		&& ball.x + ball.radius > paddles.opponent.startX)
		return true;
	return false;
};

function calculateNewBallDirection(hitPaddle: any, direction: number): void {
/* 	console.log("calculateNewBallDirection()");
 */	var collidePoint = ball.y - (hitPaddle.startY + paddleHeight/2);
	
	/* normalization */
	collidePoint = collidePoint / (paddleHeight/2);
	/* calculate angle in radian */
	var angleRad = collidePoint * Math.PI/4;

	/* increase ball speed with every paddle hit */
	ball.speed += 0.4; 

	ball.velocityX = direction *	ball.speed * Math.cos(angleRad);
	ball.velocityY = 				ball.speed * Math.sin(angleRad);
	
};

</script>

<style scoped>
canvas {
	z-index: 1;
	image-rendering: pixelated;
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