

<script setup lang="ts">
import Chat from "./Chat.vue"
import Menue from "./Menue.vue"
import Profile from "./Profile.vue"
import Game from './Game.vue'

import { store } from '../store/store.ts'
import { onMounted } from 'vue'

onMounted(() => {
	// GET specific user
	fetch('http://localhost:3000/user/1')
	.then(response => response.json())
	.then(data => {
		console.log("User:")
		console.log(data)
	})
	.catch(error => console.error('Error:', error));

	// // CHANGE specific user data
	// const postData = {
	//  pseudo: 'bitch',
	// };
	// fetch('http://localhost:3000/user/1', {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 	},
	// 	body: JSON.stringify(postData)
	// })
	//  .then(response => response.json())
	//  .then(data => console.log(data))
	//  .catch(error => console.error('Error:', error));
	
	// PUSH new match onto database
	/* const postData = {
		player1Score: 11,
		player2Score: 1,
		player1: 2,
		player2: 3,
		winner: 2,
		loser: 3
	};
	fetch('http://localhost:3000/match', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(postData)
	})
	 .then(response => response.json())
	 .then(data => console.log(data))
	 .catch(error => console.error('Error:', error)); */

	// // UPDATE match
	// const postData = {
	// 	player1Score: 1000,
	// 	player2Score: 200
	// };
	// fetch('http://localhost:3000/match/5', {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 	},
	// 	body: JSON.stringify(postData)
	// })
	//  .then(response => response.json())
	//  .then(data => console.log(data))
	//  .catch(error => console.error('Error:', error));

	// // DELETE match
	// fetch('http://localhost:3000/match/5', {
	// 	method: 'DELETE'
	// })
	// .then(response => console.log(response))
	// .catch(error => console.error('Error:', error));
})

</script>

<template>
    <!-- <h1>Playpage</h1> -->
    <div class="appbody">
        <main>
            <Game />
        </main>
        <aside>
            <Menue />
            <Chat/> 
			<!-- v-if="store.chatActive" -->
            <Profile v-if="store.profileActive" />
        </aside>
    </div>

</template>


<style scooped>



.appbody {
    background-color: black !important;
    display: grid;
    grid-template-columns: auto 30vw;
    grid-template-rows: 1fr;
    grid-column-gap: 20px;
    /* height: 100%; */
}

aside {
    width: 30vw;
    max-width: 400px;
    height: 100%;
    /* max-width: 500px; */
}

h1 {
    font-size: 2rem !important;
}



</style>