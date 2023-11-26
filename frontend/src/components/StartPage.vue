<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onBeforeMount, ref } from 'vue';
import NoConnectModal from './errorPages/NoConnectModal.vue';

const router = useRouter();

const connectError = ref(false);

onBeforeMount(() => {
	checkIfRedirect();
})

async function checkIfRedirect() {
	try {
		const response = await fetch('http://' + import.meta.env.VITE_CURRENT_HOST + ':3000/auth/isAuthenticated', {
        method: 'GET',
        credentials: 'include',
    });
		const data = await response.text();
		console.log(data);
		if (data == 'true') {
			router.push('/play');
			console.log("already authenticated");
			return;
		}
	} catch (error) {
		console.error("checking session storage failed: ", error);
		connectError.value = true;
	}
};

async function startAuth() {
	try {
		const response = await fetch('http://' + import.meta.env.VITE_CURRENT_HOST + ':3000/auth/init');
		const data = await response.text();
		console.log(data);
		window.location.href = data;
	} catch (error) {
		console.error("Init Authentication failed");
		connectError.value = true;
	}
}

</script>

<template>
	<section class="logo">
		Ping&#160;&#160;&#160;&#160;&#160;&#160;&#160; <br>
		Pang <br>
		&#160;&#160;&#160;&#160;&#160;&#160;&#160;Pong
	</section>
	<button @click="startAuth" class="buttonLogin">
		Log in
	</button>
	<NoConnectModal v-if="connectError" @close="connectError = false"/>
</template>

<style scoped>
a:link {
	color: white;
	text-decoration: none;
}

section {
	font-size: var(--font-size-xxxl);
	letter-spacing: 0px;
	line-height: calc(30px + 5vw);
	width: 100%;
	text-align: center;
	text-align: center;
	margin-top: 10vh;
}

.logo {
	font-family: 'Logofont';
}

body {
	font-family: 'textfont', sans-serif;
}

p {
	text-align: center;
	font-family: 'textfont', sans-serif;
}

img {
	width: 800px;
	display: block;
	margin: 20vh auto 0 auto;
}

button.buttonLogin {
	display: block;
	margin: 10vh auto 0 auto;
	border: 2px solid white;
	text-align: center;
	font-size: var(--font-size-base);
	/* //padding: 2vh 6vw; */
	padding-left: min(60px, 6vw);
	padding-right: min(60px, 6vw);
	padding-bottom: min(20px, 6vw);
	padding-top: min(20px, 6vw);
	transition: 0.3s;
}

button.buttonLogin:hover {
	background-color: white;
	color: black;
}

.leaderboard {
	margin: 0;
	font-size: var(--font-size-tiny);
}

.position {
	margin: 0;
	top: 7px;
	position: relative;
	color: tomato;
	font-family: 'logofont', sans-serif;
	font-size: var(--font-size-lg);
}
</style>