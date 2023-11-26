<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { whoIam } from '../../utils/whoIam.ts'
import { authGuard } from '../../utils/authGuard.ts'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps(['user_id'])

const user = ref({
	id: 0,
	fortytwo_id: 0,
	pseudo: "unknown",
	email: "unkown",
	avatar: "https://as2.ftcdn.net/v2/jpg/05/41/19/11/1000_F_541191198_O3s9TihGlfU58XP5oJXYaQ5y4rvuy7AK.jpg",
	is2FActive: false,
	is2FAuthenticated: false
})

onMounted(() => {
	authGuard(router)
	getUser(props.user_id)
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
		<!-- <div class="profile-component">
			<button class="profile-button" @click="matchHistoryActive = !matchHistoryActive">match history</button>
			<MatchHistory v-if="matchHistoryActive"/>
		</div>
		<div class="profile-component">
			<button class="profile-button" id="leaderboard" @click="goToLeaderboard">leaderboard <span>⤴</span></button>
		</div>
		<div class="profile-component">
			<button class="profile-button" @click="settingsActive = !settingsActive">settings</button>
			<Settings v-if="settingsActive" @userDataChanged="getCurrUser"/>
		</div> -->
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

	#leaderboard {
		/* color: rgb(185, 185, 185); */
		font-weight: 900;
	}
	#leaderboard:hover {
		/* color: rgb(53, 53, 53); */
	}
	span {
		top: 443px;
		position: absolute;
		font-size: var(--font-size-sm);
	}

</style>
