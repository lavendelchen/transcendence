<template>
	<div class="block" v-if="showBlock" @mousedown="stopTimer()">click me</div>
</template>

<script lang="ts">
export default {
	props: [
		'delay',
	],
	data() {
		return {
			showBlock: false,
			startTime: 0,
			reactionTime: 0,
		}
	},
	mounted() {
		setTimeout(() => {
			this.showBlock = true;
			this.startTimer();
		}, this.delay);
	},
	methods: {
		startTimer() {
			this.startTime = Date.now();
		},
		stopTimer() {
			this.reactionTime = Date.now() - this.startTime;
			this.$emit('clicked', this.reactionTime);
		},
	},
}
</script>

<style>
	.block {
		width: 400px;
		border-radius: 20px;
		background-color: aquamarine;
		color: black;
		padding: 100px 0;
		margin: 40px auto;
		text-align: center;
	}
</style>