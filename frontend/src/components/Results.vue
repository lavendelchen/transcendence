<template>
	<p>Reaction Time: {{ score }} ms</p>
	<h3>{{ rank }}</h3>
</template>

<script lang="ts">
export default {
	props: [
		'score',
	],
	data() {
		return {
			rank: "none"
		}
	},
	mounted() {
		if (this.score < 150)
			this.rank = "One with the wind";
		else if (this.score < 250)
			this.rank = "Ninja Fingers!";
		else if (this.score < 400)
			this.rank = "Good reflexes!";
		else
			this.rank = "Snail pace 🐌";
	}
}
</script>

<style>
	
</style>