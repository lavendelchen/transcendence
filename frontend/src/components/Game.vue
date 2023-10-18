<template>
	<canvas id="gameCanvas" :width="gameWidth" :height="gameHeight"></canvas>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

/* these variables can be customized */
const gameSize = 1;
let backgroundColor = "white";
let elementColor = "black";
const framesPerSecond = 50;//fix
const baseBallSpeed = 8;
/* not these please */
const gameWidth = 1000*gameSize;
const gameHeight = 800*gameSize;
const fontSize = 50*gameSize;
const paddleWidth = 12*gameSize;
const paddleHeight = 85*gameSize;
const PLAYER = 1;
const OPPONENT = -1;
let interval: number;

let canvas: CanvasRenderingContext2D;

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
	const element = document.getElementById("gameCanvas") as HTMLCanvasElement;
	canvas = element.getContext("2d") as CanvasRenderingContext2D;
	canvas.textAlign = 'center';
	element.addEventListener("mousemove", movePaddle);

	initBallDirection();
	interval = setInterval(game, 1000/framesPerSecond);
});

/* functions */
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
		if (opponent.score >= 11)
			gameEnd("YOU HAVE LOST :(");
		resetBall();
		setTimeout(() => initBallDirection(), 1000);
	}
	else if (ballHitRight()) {
		player.score++;
		if (player.score >= 11)
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
    canvas.fillStyle = elementColor;
    canvas.font = fontSize.toString() + "px textfont";
    canvas.fillText(message, gameWidth/2, gameHeight/2);

	// send data to database n shit
};
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
	canvas.fillStyle = color;
	canvas.fillRect(startX, startY, lengthX, lengthY);
};
function drawBall(): void {
	canvas.fillStyle = elementColor;
	canvas.beginPath();
	canvas.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2, false);
	canvas.closePath();
	canvas.fill();
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
	canvas.fillStyle = elementColor;
	canvas.font = fontSize.toString() + "px textfont";
	canvas.fillText(player.score.toString(), gameWidth/4, gameHeight/6);
	canvas.fillStyle = elementColor;
	canvas.font = fontSize.toString() + "px textfont";
	canvas.fillText(opponent.score.toString(), 3*gameWidth/4, gameHeight/6);
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
#gameCanvas {
}
</style>