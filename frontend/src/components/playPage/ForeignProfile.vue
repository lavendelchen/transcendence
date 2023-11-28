<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { whoIam } from '../../utils/whoIam.ts'
import { authGuard } from '../../utils/authGuard.ts'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps(['user_id'])

const friendMsg = ref("Add as friend")
const errorMsg = ref("")
let friendshipID = 0;

const user = ref({
	id: 0,
	fortytwo_id: 0,
	pseudo: "unknown",
	email: "unkown",
	avatar: "https://as2.ftcdn.net/v2/jpg/05/41/19/11/1000_F_541191198_O3s9TihGlfU58XP5oJXYaQ5y4rvuy7AK.jpg",
	is2FActive: false,
	is2FAuthenticated: false,
	wonMatchesCount: 0,
	lostMatchesCount: 0,
	matchesCount: 0,
	pointsMade: 0,
	pointsLost: 0,
	friends: []
})

const currUser = ref<any>(null as any)

onMounted(() => {
	authGuard(router)
	getUser(props.user_id).then(() => 
	getCurrUser())
	
})

async function getUser(user_id: number) {
	fetch('http://' + import.meta.env.VITE_CURRENT_HOST + ':3000/user/' + user_id, {
		method: 'GET',
		credentials: 'include'
	})
	.then(response => response.json())
	.then(data => {
		console.log("user:")
		console.log(data)
		user.value = data;
		console.log(user.value)
	})
	.catch(error => console.error("ForeignProfile Error:" + error.message))
}

async function getCurrUser() {
	currUser.value = await whoIam()
	if (!currUser.value)
		router.push('/not-allowed')
	console.log(currUser.value)
	console.log(currUser.value.friends)
	currUser.value.friends.forEach((friend: any, index: number) => {
		if (friend.followedUser.id == user.value.id) {
			friendMsg.value = "added as friend ✅"
			friendshipID = friend.id;
		}
	});
}

function addFriend() {
	fetch('http://' + import.meta.env.VITE_CURRENT_HOST + ':3000/friend/', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			user: currUser.value.id,
			followedUser: user.value.id,
			isPending: false
		})
	})
	.then(response => response.json())
	.then(data => {
		if ('statusCode' in data) {
			if (data.statusCode == 500) {
				errorMsg.value = "Couldn't add as friend"
				return;
			}
		}
		console.log("data: ")
		console.log(data)
		friendshipID = data.id
		friendMsg.value = 'added as friend ✅'
		errorMsg.value = ""
	})
	.catch(error => {
		console.error(error)
		errorMsg.value = "Couldn't add as friend"
		return;
	});
}

function removeFriend() {
	fetch('http://' + import.meta.env.VITE_CURRENT_HOST + ':3000/friend/' + friendshipID, {
		method: 'DELETE',
		credentials: 'include'
	})
	.then(response => {
		console.log(response)
		if (response.status != 200) {
			errorMsg.value = "Couldn't remove friend"
			return;
		}
		friendMsg.value = 'Add as friend'
		errorMsg.value = ""
	})
	.catch(error => {
		console.error(error)
		errorMsg.value = "Couldn't remove friend"
		return;
	});
}

</script>

<template>
    <div class="profile">
		<h3> Player </h3>
        <div class="hero">
            <!-- <img src="../../assets/img/profileCircle.svg" alt="PROFILE PICTURE"> -->
            <img :src="user.avatar" alt="PROFILE PICTURE">
            <div>
                <p id="name">{{ user.pseudo }}</p>
            </div>
        </div>
		<div class="profile-component statsFullContainer">
			<p class="statHeaderContainer">
				<span class="statHeader">Wins</span>
				<span class="statHeader">Losses</span>
				<span class="statHeader">Total Games</span>
			</p>
			<p class="statsContainer">
				<span class="stats" id="wonGames">{{ user.wonMatchesCount }}</span>
				<span class="stats" id="lostGames">{{ user.lostMatchesCount }}</span>
				<span class="stats" id="playedGames">{{ user.matchesCount }}</span>
			</p>
			<p class="statHeaderContainer">
				<span class="statHeader">Points made</span>
				<span class="statHeader">Points lost</span>
			</p>
			<p class="statsContainer">
				<span class="stats" id="pointsMade">{{ user.pointsMade }}</span>
				<span class="stats" id="pointsLost">{{ user.pointsLost }}</span>
			</p>
		</div>
		<div class="profile-component">
			<button class="profile-button" @click="friendMsg == 'Add as friend' ? addFriend() : removeFriend()">{{ friendMsg }}</button>
		</div>
		<p v-if="errorMsg" id="errorMsg"> {{ errorMsg }}</p>
    </div>
</template>

<style scoped>

	h3 {
    	padding: 0px 10px 10px 10px;
    	height: 2rem;
    	width: auto;
    	margin: 10px 10px 10px 10px;
		text-overflow: ellipsis;
		overflow: hidden;
	}
  
    .profile {
		margin-top: 50px;
        padding: 10px;
        border: 1px solid white;
		max-height: 70vh;
		overflow-y: scroll;
    }
    .hero {
        display: grid;
        grid-template-columns: 1fr 2fr;
		align-items: center;
		overflow: hidden;
		margin-bottom: 20px;
    }
	
    img {
		width: 100px;
		height: 100px;
		object-fit: cover;
		border-radius: 50%;
		vertical-align: middle;
		margin: 5px;
	}
	
	#name {
		text-align: center;
		padding-left: 10px;
		max-width: 100%;
		/* border: 1px solid white; */
	}

	.profile-component {
		border-top: 1px solid white;
	}

	.profile-button {
		width: 90%;
		font-size: var(--font-size-tiny);
		border-width: 1px;
		/* border: 0px; */
		margin-top: 20px;
		margin-bottom: 20px;
		margin-left: auto;
		margin-right: auto;
	}

	.statsFullContainer {
		padding-top: 8px;
	}

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

	#errorMsg {
		color: red;
	}

</style>
