<script setup lang="ts">
import Chat from "./chat/Chat.vue"
import Menue from "./Menue.vue"
import Profile from "./profile/Profile.vue"
import ForeignProfile from "./ForeignProfile.vue"
import Game from './Game.vue'
import NoConnectModal from "../errorPages/NoConnectModal.vue"

import { store } from '../../store/store.ts'
import { authGuard } from '../../utils/authGuard.ts'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const connectError = ref(false);
const foreignUserId = ref(0);

onMounted(() => {
	checkConnectError()
	.then(() => 
	authGuard(router))
})

async function checkConnectError() {
	try {
		await fetch('http://' + import.meta.env.VITE_CURRENT_HOST + ':3000/auth/isAuthenticated')
	} catch (error) {
		console.error("checking session storage failed: ", error);
		connectError.value = true;
	}
}

</script>

<template>
	<h1>ping pang pong</h1>
	<div class="appbody">
		<main>
			<Game @connectError="connectError = true"/>
		</main>
		<aside>
			<Menue />
			<Chat v-if="store.chatActive" />
			<Profile v-if="store.profileActive" />
			<ForeignProfile v-if="store.foreignProfileActive" :user_id="store.foreignProfileID"/>
		</aside>
	</div>
	<NoConnectModal v-if="connectError"/>
</template>



<style scoped>

h1 {
	padding-bottom: 2vh;
	/* border-bottom: 1px solid white; */
}

main {
	/* margin-top: 130px; */
	margin-top: 21.5px;
}

@media screen and (max-width: 992px) {
	main {
		margin-left: 4vw;
	}
}

@media screen and (min-width: 992px) {
	main {
		margin-left: 20px;
	}
}

.appbody {
	background-color: black !important;
	display: grid;
	grid-template-columns: auto 30vw;
	grid-template-rows: 1fr;
	grid-column-gap: 20px;
	/* height: 100%; */
	width: 100%;
}

@media screen and (max-width: 1000px) {
	aside {
		display: none !important;
	}
}

@media screen and (min-width: 1000px) {

aside {
	position:absolute;
	top: 10px;
	justify-self: end;
	margin-right: 20px;
}

@media screen and (max-width: 1000px) {
	aside {
		display: none !important;
	}
}

@media screen and (min-width: 1000px) {
	aside {
		height: 100%;
		width: 30vw;
		max-width: 400px;

		/* max-width: 500px; */
	}
}
}

h1 {
	font-size: 2rem !important;
}

</style>