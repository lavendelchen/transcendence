<template>
	<h1>Ninja Reaction Timer</h1>
	<button @click="start" :disabled="currentlyPlaying">play</button>
	<Block v-if="currentlyPlaying" :delay="delay" @clicked="endGame"></Block>
	<Results v-if="score && !currentlyPlaying" :score="score"/>
	<br><br><br><br><br><br><br><br><br><br><br><br><br><br>
	<Jobs/>
</template>

<script lang="ts">
	import './assets/main.css'
	import StartPage from "./components/StartPage.vue"
	import PlayPage from "./components/PlayPage.vue"
	import Block from "./components/Block.vue"
	import Results from "./components/Results.vue"
	import Jobs from './components/Jobs.vue'

	export default {
		name: 'App',
		components: {
			StartPage,
			PlayPage,
			Block,
			Results,
			Jobs
		},
		data() {
			return {
				currentlyPlaying: false,
				delay: 0,
				score: 0,
			}
		},
		methods: {
			start() {
				this.delay = 2000 + (Math.random() * 5000);
				this.currentlyPlaying = true;
			},
			endGame(reactionTime: number) {
				this.score = reactionTime;
				this.currentlyPlaying = false;
			}
		},
	}
</script>

<style>
@font-face {
		font-family: 'textfont';
		src: url('/fonts/Pixeled.ttf');
}
@font-face {
	font-family: 'logofont';
	src: url('/fonts/gameboy.ttf');
}

p {
	text-align: center;
	text-transform: lowercase;
}

h1 {
	font-family: 'logofont';
	text-align: center;
}

h3 {
	font-family: 'logofont';
	font-size: 26px;
	color: darkorange;
}

button {
	font-family: 'textfont', sans-serif;
	display: block;
	text-align: center;
	text-transform: uppercase;
	margin: 0 auto;
	background-color: rgb(157, 157, 157);
	padding: 10px 20px;
	border-radius: 5px;
}

button[disabled] {
	cursor: not-allowed;
}

#app {
	font-family: 'textfont', sans-serif;
	text-transform: uppercase;
	text-align: center;
}
</style>
