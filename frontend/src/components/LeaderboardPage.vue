<template>
	<h1>Leaderboard</h1>
	<p v-if="players.length > 0">
		<span id="rank">Rank</span>
		<span id="pseudo">Name</span>
		<span id="img"></span>
		<span id="legend">Wins</span>
		<span id="legend">Losses</span>
		<span id="legend">Total Games</span>
		<span id="legend">Points made</span>
		<span id="legend">Points lost</span>
	</p>
	<div id="leaderboardBox" v-if="players.length > 0">
		<p v-for="player in players" :key="player.rank" class="leaderboardEntries">
			<span id="rank">{{ player.rank }}</span>
			<span id="pseudo" class="name" @click="goToOpponentProfile(player.id)">{{ player.pseudo }}</span>
			<img  id="img" class="name" @click="goToOpponentProfile(player.id)" :src="player.avatar" alt="Player Avatar">
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
	import { store } from '../store/store.ts'
	import { whoIam, User } from '../utils/whoIam.ts'
	import { useRouter } from 'vue-router';

	interface Player {
	  avatar: string;
	  id: number;
	  lostMatchesCount: number;
	  matchesCount: number;
	  pointsLost: number;
	  pointsMade: number;
	  pseudo: string;
	  wonMatchesCount: number;
	  rank?: number;
	}

	export default {
		data() {
			return {
				players: [] as Player[],
				router: null as any,
				myID: 0
			}
		},
		mounted() {
			this.router = useRouter()
			this.getCurrUser()
			fetch('http://' + import.meta.env.VITE_CURRENT_HOST + ':3000/user/leaderboard')
				.then(response => response.json())
				.then(data => {
					this.players = data
		
					this.players.sort((a: any, b: any) => b.wonMatchesCount - a.wonMatchesCount );

					this.players.forEach((player, index) => {
			        	player.rank = index + 1;
				
						if (player.pseudo.length > 17) {
							player.pseudo = player.pseudo.slice(0, 17)
							player.pseudo += "..."
						}
			        });
				})
				.catch(error => console.log(error.message))
		},
		methods: {
			getCurrUser: async function() {
				const user = await whoIam()
				if (!user)
					return
				this.myID = user.id
				console.log(user as User)
			},
			goToOpponentProfile(opponent_id: number) {
				if (opponent_id == this.myID)
					return;
				console.log("hello?" + opponent_id)
				store.foreignProfileID = opponent_id;
				store.chatActive = false;
				store.profileActive = false;
				store.foreignProfileActive = true;
				this.router.push("/play");
			}
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
	max-height: 50vh;
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
	margin-right: 2vw;
	margin-top: 0.8vw;	
	margin-bottom: 0.8vw;
}

#rank {
	margin-left: 30px;
	width: 5vw;
	font-size: var(--font-size-base);
	color:rgb(204, 163, 112);
}

#legend {
	width: 10vw;
}

#pseudo {
	width: 25vw;
}

.name {
	cursor: pointer;
	transition: 0.3s;
}

.name:hover {
	color: rgb(124, 124, 124);
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