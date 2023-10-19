<template>
	<div class="stupid-container" :style="{ 'width': gameWidth + 'px', 'height': gameHeight + 'px' }">
		<button v-if="gameState != PLAYING" @click="startQueue" :disabled="gameState === WAITING_IN_QUEUE" class="playButton" :style="{ 'bottom': (gameHeight/2) + 'px', 'left': (gameWidth/2) + 'px' }">{{ buttonText }}</button>
		<canvas id="gameCanvas" :width="gameWidth" :height="gameHeight"></canvas>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref, computed, render } from 'vue';

/* these variables can be customized */
const gameSize = 0.5;
const framesPerSecond = 50;//fix
const baseBallSpeed = 8;
const pointsToWin = 2;
/* not these please */
let backgroundColor = "white";
let elementColor = "black";
const gameWidth = 1000*gameSize;
const gameHeight = 800*gameSize;
const fontSize = 50*gameSize;
const paddleWidth = 12*gameSize;
const paddleHeight = 85*gameSize;
const PLAYER = 1;
const OPPONENT = -1;
let interval: number;
let context: CanvasRenderingContext2D;
let canvas: HTMLCanvasElement;

/* not directly part of game */
const NOT_PLAYING: number = 0;
const WAITING_IN_QUEUE: number = 1;
const PLAYING: number = 2;
let gameState: Ref<number> = ref(NOT_PLAYING);
let buttonText = ref("play");

const net = {
	width: 3*gameSize,
	height: 15*gameSize,
	gaps: 10*gameSize
};
const player = {
	paddleStartX: 30*gameSize,
	paddleStartY: gameHeight/2 - paddleHeight/2,
	score: 0
};
const opponent = {
	paddleStartX: gameWidth - 30*gameSize - paddleWidth, // which x & y
	paddleStartY: gameHeight/2 - paddleHeight/2,
	score: 0
};
const ball = {
	x: gameWidth/2,
	y: gameHeight/2,
	radius: 8*gameSize,
	speed: 0*gameSize,//fix
	velocityX: 0*gameSize,//fix
	velocityY: 0*gameSize//fix
};

onMounted(() => {
	canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
	context = canvas.getContext("2d") as CanvasRenderingContext2D;
	context.textAlign = 'center';
	renderElements();
});

/* functions */
function startQueue() {
	buttonText.value = "Waiting for opponent...";
	gameState.value = WAITING_IN_QUEUE;
	setTimeout(() => {
		renderElements();
		buttonText.value = "3";
	}, 1000);
	setTimeout(() => buttonText.value = "2", 2000);
	setTimeout(() => buttonText.value = "1", 3000);
	setTimeout(() => startGame(), 4000);
}
function startGame(): void {
	gameState.value = PLAYING;
	canvas.addEventListener("mousemove", movePaddle);
	initBallDirection();
	setTimeout(() => {
		interval = setInterval(game, 1000/framesPerSecond);
	}, 1000);
}
function game(): void {
	updatePositions();
	renderElements();
};
function updatePositions(): void {
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;

	if (ballHitTopOrBottom())
		ball.velocityY *= -1;
	else if (ballHitPlayerPaddle())
		calculateNewBallDirection(player, PLAYER);
	else if (ballHitOpponentPaddle())
		calculateNewBallDirection(opponent, OPPONENT);
	else if (ballHitLeft()) {
		opponent.score++;
		if (opponent.score >= pointsToWin)
			gameEnd("YOU HAVE LOST :(");
		resetBall();
		setTimeout(() => initBallDirection(), 1000);
	}
	else if (ballHitRight()) {
		player.score++;
		if (player.score >= pointsToWin)
			gameEnd("YOU HAVE WON!");
		resetBall();
		setTimeout(() => initBallDirection(), 1000);
	}
};
function renderElements(): void {
	drawRectangle(0, 0, gameWidth, gameHeight, backgroundColor);
	drawBall();
	drawPaddles();
	drawNet();
	drawScore();
};
function movePaddle(this: HTMLCanvasElement, event: MouseEvent): void {//HTMLCanvasElement
	let mouse = this.getBoundingClientRect();

	if (event.clientX < gameWidth/2)
		var currentlyPlaying = player;
	else
		var currentlyPlaying = opponent;

	if (event.clientY - mouse.top - paddleHeight/2 < 0)
		currentlyPlaying.paddleStartY = 0;
	else if (event.clientY - mouse.top + paddleHeight/2 >= gameHeight)
		currentlyPlaying.paddleStartY = gameHeight - paddleHeight;
	else
		currentlyPlaying.paddleStartY = event.clientY - mouse.top - paddleHeight/2;
};
async function gameEnd(message: string): Promise<void> {
    resetBall();
    
    const clearIntervalPromise = new Promise<void>((resolve) => {
        setTimeout(() => {
            clearInterval(interval);
            resolve();
        }, 0); // 0 milliseconds delay, executes on the next tick
    });

    await clearIntervalPromise;

    elementColor = "white";
    backgroundColor = "black";
    ball.x = -10 * gameSize;
    ball.y = -10 * gameSize;
    renderElements();
    context.fillStyle = elementColor;
    context.font = fontSize.toString() + "px textfont";
    context.fillText(message, gameWidth/2, gameHeight/2);

	// send data to database n shit
	setTimeout(() => resetGame(), 1000);
};
function resetGame(): void {
	backgroundColor = "white";
	elementColor = "black";
	player.paddleStartY = gameHeight/2 - paddleHeight/2;
	player.score = 0;
	opponent.paddleStartY = gameHeight/2 - paddleHeight/2;
	ball.x = gameWidth/2;
	ball.y = gameHeight/2;
	ball.velocityX = 0;
	ball.velocityY = 0;
	ball.speed = 0;
	opponent.score = 0;
	gameState.value = NOT_PLAYING;
	buttonText.value = "play";
}
function initBallDirection(): void {
	var random = Math.floor(Math.random() * 4);
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
}
function drawRectangle(startX: number, startY: number, lengthX: number, lengthY: number, color: string): void {
	context.fillStyle = color;
	context.fillRect(startX, startY, lengthX, lengthY);
};
function drawBall(): void {
	context.fillStyle = elementColor;
	context.beginPath();
	context.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2, false);
	context.closePath();
	context.fill();
};
function drawPaddles(): void {
	drawRectangle(player.paddleStartX, player.paddleStartY, paddleWidth, paddleHeight, elementColor);
	drawRectangle(opponent.paddleStartX, opponent.paddleStartY, paddleWidth, paddleHeight, elementColor);
}
function drawNet(): void {
	for(let i = 5; i <= gameHeight; i += (net.gaps + net.height)) { //+=?? {
		drawRectangle((gameWidth/2 - net.width/2), i, net.width, net.height, elementColor);
	}
}
function drawScore(): void {
	context.fillStyle = elementColor;
	context.font = fontSize.toString() + "px textfont";
	context.fillText(player.score.toString(), gameWidth/4, gameHeight/6);
	context.fillStyle = elementColor;
	context.font = fontSize.toString() + "px textfont";
	context.fillText(opponent.score.toString(), 3*gameWidth/4, gameHeight/6);
};
function resetBall(): void {
	ball.x = gameWidth / 2;
	ball.y = gameHeight / 2;
	ball.velocityX = 0;
	ball.velocityY = 0;
}
function ballHitTopOrBottom(): boolean {
	if (ball.y + ball.radius > gameHeight ||
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
	if (ball.x + ball.radius > gameWidth)
		return true;
	return false;
}
function ballHitPlayerPaddle(): boolean {
	if (ball.x - ball.radius < player.paddleStartX + paddleWidth
		&& ball.y + ball.radius > player.paddleStartY
		&& ball.y - ball.radius <  player.paddleStartY + paddleHeight
		&& ball.x + ball.radius > player.paddleStartX)
		return true;
	return false;
};
function ballHitOpponentPaddle(): boolean {
	if (ball.x - ball.radius < opponent.paddleStartX + paddleWidth
		&& ball.y + ball.radius > opponent.paddleStartY
		&& ball.y - ball.radius <  opponent.paddleStartY + paddleHeight
		&& ball.x + ball.radius > opponent.paddleStartX)
		return true;
	return false;
};
function calculateNewBallDirection(hitPaddle: any, direction: number): void {
	var collidePoint = ball.y - (hitPaddle.paddleStartY + paddleHeight/2);
	
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
}

.playButton {
	z-index: 0;
	position: absolute;
	padding: 30px;
	transform: translate(-50%, -50%);
}

/* .stupid-container {
	width: v-bind('gameWidth');
	height: v-bind('gameHeight');
} */

</style>