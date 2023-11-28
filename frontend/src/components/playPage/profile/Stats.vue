<template>
	<p class="statHeaderContainer">
		<span class="statHeader">Wins</span>
		<span class="statHeader">Losses</span>
		<span class="statHeader">Total Games</span>
	</p>
	<p class="statsContainer">
		<span class="stats" id="wonGames">{{ wonMatches }}</span>
		<span class="stats" id="lostGames">{{ lostMatches }}</span>
		<span class="stats" id="playedGames">{{ matchesCount }}</span>
	</p>
	<p class="statHeaderContainer">
		<span class="statHeader">Points made</span>
		<span class="statHeader">Points lost</span>
	</p>
	<p class="statsContainer">
		<span class="stats" id="pointsMade">{{ pointsMade }}</span>
		<span class="stats" id="pointsLost">{{ pointsLost }}</span>
	</p>
</template>

<script lang='ts'>
export default {
	props: [
		'wonMatches',
		'lostMatches',
		'matchesCount',
		'pointsMade',
		'pointsLost'
	]
}
</script>

<style scoped>

	.statHeaderContainer {
		margin-bottom: 7px;
	}
	.statHeader {
		display: inline-block;
		font-size: var(--font-size-tiny);
		width: 80px;
		margin-left: 5px;
		margin-right: 5px;
		margin-bottom: 0px;
	}

	.statsContainer {
		margin-top: 0px;
	}
	.stats {
		display: inline-block;
		padding-top: 0px;
		margin-left: 5px;
		margin-right: 5px;
		margin-bottom: 5px;
		width: 80px;
	}

	#wonGames {
		color:rgb(41, 155, 33);
	}

	#lostGames {
		color:rgb(205, 31, 31);
	}

	#playedGames {
		color:white;
	}

	#pointsMade {
		color:rgb(78, 132, 75);
	}

	#pointsLost {
		color:rgb(197, 81, 81);
	}

</style>