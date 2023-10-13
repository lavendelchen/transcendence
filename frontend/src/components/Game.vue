<template>
	<canvas id="gameCanvas" :width="gameWidth" :height="gameHeight"></canvas>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

/* these variables can be customized */
const gameSize = 1;
const backgroundColor = "white";
const elementColor = "black";
const framesPerSecond = 50;//fix
/* not these please */
const gameWidth = 1000*gameSize;
const gameHeight = 800*gameSize;
const fontSize = 50*gameSize;
const paddleWidth = 12*gameSize;
const paddleHeight = 85*gameSize;

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
	speed: 5*gameSize,//fix
	velocityX: 5*gameSize,//fix
	velocityY: 5*gameSize//fix
};

onMounted(() => {
	const element = document.getElementById("gameCanvas") as HTMLCanvasElement;
	canvas = element.getContext("2d") as CanvasRenderingContext2D;
	canvas.textAlign = 'center';
	element.addEventListener("mousemove", movePaddle);

	initBallDirection();
	setInterval(game, 1000/framesPerSecond);
});

/* functions */
function game(): void {
	updatePositions();
	renderElements();
};
function updatePositions(): void {
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;

	let ballTop = ball.y - ball.radius;
	let ballBottom = ball.y + ball.radius;
	let ballLeft = ball.x - ball.radius;
	let ballRight = ball.x + ball.radius;
	let playerPaddleEndX = player.paddleStartX + paddleWidth;
	let playerPaddleEndY = player.paddleStartY + paddleHeight;
	let opponentPaddleEndX = opponent.paddleStartX + paddleWidth;
	let opponentPaddleEndY = opponent.paddleStartY + paddleHeight;

	if (ballBottom > gameHeight ||
		ballTop < 0)
		ball.velocityY *= -1;
	if (ballRight > gameWidth ||//ehh
		ballLeft < 0)//ehh
		ball.velocityX *= -1;//ehh

	if (ballLeft < playerPaddleEndX && ballBottom > player.paddleStartY
		&& ballTop < playerPaddleEndY)
		ball.velocityX *= -1;
};
function renderElements(): void {
	drawRectangle(0, 0, gameWidth, gameHeight, backgroundColor);
	drawBall();
	drawPaddles();
	drawNet();
	drawScore();
};
function movePaddle(event: MouseEvent) HTMLCanvasElement : void {
	let rectangle = this.getBoundingClientRect();

}
// function paddleHit(player )
function initBallDirection(): void {
	var random = Math.floor(Math.random() * 4);
	switch (random) {
		case 0:
			ball.velocityX = -5*gameSize;
			ball.velocityY = -5*gameSize;
			break;
		case 1:
			ball.velocityX = -5*gameSize;
			ball.velocityY = 5*gameSize;
			break;
		case 2:
			ball.velocityX = 5*gameSize;
			ball.velocityY = -5*gameSize;
			break;
		case 3:
			ball.velocityX = 5*gameSize;
			ball.velocityY = 5*gameSize;
			break;
	}
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
</script>

<style scoped>
#gameCanvas {
}
</style>