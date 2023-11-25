<template>
	<h3 v-if="player1Matches.length > 0">Initiated matches</h3>
	<p v-if="player1Matches.length > 0" class="header">
		<span class="opponent">Opponent</span>
		<span class="yourScore">Your Score</span>
		<span class="opponentScore">Opponent score</span>
	</p>
	<div class="matchesBox" v-if="player1Matches.length > 0">
		<p class="match" v-for="match in player1Matches" :key="match.id"		>
			<span class="opponent">{{ match.player2.pseudo}}</span>
			<span class="yourScore" 
				:style="{ 'color': match.player1Score > match.player2Score ? 'rgb(41, 155, 33)' : 'rgb(205, 31, 31)' }"
			>{{ match.player1Score }}</span>
			<span class="opponentScore"
				:style="{ 'color': match.player1Score > match.player2Score ? 'rgb(41, 155, 33)' : 'rgb(205, 31, 31)' }"
			>{{ match.player2Score }}</span>
		</p>
	</div>
	<h3 v-if="player1Matches.length > 0">Accepted matches</h3>
	<p v-if="player1Matches.length > 0" class="header">
		<span class="opponent">Opponent</span>
		<span class="yourScore">Your Score</span>
		<span class="opponentScore">Opponent score</span>
	</p>
	<div class="matchesBox" v-if="player2Matches.length > 0">
		<p class="match" v-for="match in player2Matches" :key="match.id">
			<span class="opponent">{{ match.player1.pseudo}}</span>
			<span class="yourScore" 
				:style="{ 'color': match.player1Score < match.player2Score ? 'rgb(41, 155, 33)' : 'rgb(205, 31, 31)' }"
			>{{ match.player2Score }}</span>
			<span class="opponentScore"
				:style="{ 'color': match.player1Score < match.player2Score ? 'rgb(41, 155, 33)' : 'rgb(205, 31, 31)' }"
			>{{ match.player1Score }}</span>
		</p>
	</div>
	<p  v-if="player1Matches.length <= 0 && player2Matches.length <= 0">
		no matches played yet
	</p>
</template>

<script lang="ts">
	import { whoIam, User } from '../../../utils/whoIam.ts'
	import { useRouter } from 'vue-router';

	interface Match {
	  id: number;
	  player1Score: number;
	  player2Score: number;
	  winner: User;
	}

	export default {
		data() {
			return {
				user: null as User | null,
				player1Matches: [] as any[],
				player2Matches: [] as any[]
			}
		},
		mounted() {
			this.getCurrUser().then(() => 
			fetch('http://' + import.meta.env.VITE_CURRENT_HOST + ':3000/user/' + this.user?.id + '/matchHistory'))
			.then(response => response.json())
			.then(data => {
				console.log(data.player1Matches)
				this.player1Matches = data.player1Matches
				this.player2Matches = data.player2Matches
				console.log("received: ")
				console.log(this.player1Matches)
				this.player1Matches.sort((a: any, b: any) => b.id - a.id)
				this.player2Matches.sort((a: any, b: any) => b.id - a.id)

				// this.players.forEach((player, index) => {
			    // 	player.rank = index + 1;
			
				// 	if (player.pseudo.length > 17) {
				// 		player.pseudo = player.pseudo.slice(0, 17)
				// 		player.pseudo += "..."
				// 	}
			    // });
			})
			.catch(error => console.log(error.message))
		},
		methods: {
			getCurrUser: async function() {
				this.user = await whoIam()
				if (!this.user)
					console.error('huh? no user?')
				console.log("user: ")
				console.log(this.user as User)
			}
		}
	}
</script>

<style scoped>

h3 {
	font-size: var(--font-size-sm);
}

.match {
	/* border: 2px solid; */
	/* border-radius: 50px; */
	/* margin: 0; */
}

.matchesBox {
	max-height: 20vh;
	overflow: scroll;
}

span {
	display: inline-block;
	overflow-y: hidden;
}

.opponent {
	width: 50%;
	overflow-x: hidden;
	text-overflow: ellipsis;
}

.yourScore {
	width: 25%;
}

.opponentScore {
	width: 25%;
}

.header {
	font-size: var(--font-size-tiny);
}

</style>