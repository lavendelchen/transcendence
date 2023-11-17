<template>
	<h1>Leaderboard</h1>
	<p v-if="players.length > 0">
		<span id="img"></span>
		<span id="pseudo">Name</span>
		<span id="legend">Wins</span>
		<span id="legend">Losses</span>
		<span id="legend">Total Games</span>
		<span id="legend">Points made</span>
		<span id="legend">Points lost</span>
	</p>
	<div id="leaderboardBox" v-if="players.length > 0">
		<p v-for="player in players" :key="player.id" class="leaderboardEntries">
			<img id="img" :src="player.avatar" alt="Player Avatar"> <!-- make hyperlink? -->
			<span id="pseudo">{{ player.pseudo }}</span>
			<span id="wonGames">{{ player.wonMatchesCount }}</span>
			<span id="lostGames">{{ player.lostMatchesCount }}</span>
			<span id="playedGames">{{ player.matchesCount }}</span>
			<span id="pointsMade">{{ player.pointsMade }}</span>
			<span id="pointsLost">{{ player.pointsLost }}</span>
		</p>
	</div>
	<p v-else>
		no leaderboard available
	</p>
</template>

<script lang="ts">
	interface Player {
	  avatar: string;
	  id: number;
	  lostMatchesCount: number;
	  matchesCount: number;
	  pointsLost: number;
	  pointsMade: number;
	  pseudo: string;
	  wonMatchesCount: number;
	}

	export default {
		data() {
			return {
				players: [] as Player[]
			}
		},
		mounted() {
			fetch('http://localhost:3000/user/leaderboard') // do we need to sort them?
				.then(response => response.json())
				.then(data => {
					this.players = data
					this.players.forEach((player, index) => {
						if (player.pseudo.length > 17) {
							player.pseudo = player.pseudo.slice(0, 17)
							player.pseudo += "..."
						}
					})
				})
				.catch(error => console.log(error.message))
		}
	}
</script>

<style scoped>

.leaderboardEntries {
	/* border: 2px solid;
	border-radius: 50px; */
	margin: 0;
}

#leaderboardBox {
	height: 70vh;
	overflow: scroll;
}

span {
	display: inline-block;
}

#img {
	width: 90px;
	height: 90px;
	object-fit: cover;
	border-radius: 50%;
	display: inline-block;
	vertical-align: middle;
	padding: 2vw; /* vw or fixed? */
}

#legend {
	width: 10vw;
}

#pseudo {
	width: 30vw;
}

#wonGames {
	width: 10vw;
	color:rgb(41, 155, 33);
}

#lostGames {
	width: 10vw;
	color:rgb(205, 31, 31);
}

#playedGames {
	width: 10vw;
	color:rgb(163, 163, 163);
}

#pointsMade {
	width: 10vw;
	color:rgb(78, 132, 75);
}

#pointsLost {
	width: 10vw;
	color:rgb(197, 81, 81);
}


</style>