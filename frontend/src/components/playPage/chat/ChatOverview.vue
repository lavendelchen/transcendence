<template>
	<div class="channels" v-if="channels.length > 0">
		<div v-for="channel in channels" :key="channel.id"  @click="$emit('join', channel)" class="channel">
			{{ channel.name }}
		</div>
	</div>
	<div class="controls">
		<button @click="showModal = true">Create new chat (not working yet)</button>
		<div class="commands">
			<p>input commands (nothing happening yet)</p>
			<!-- input NOT WORKING YET -->
			<input> 
		</div>
	</div>

	<CreateChatModal v-if="showModal" @close="showModal = false"/>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue'
import CreateChatModal from './CreateChatModal.vue'
import { whoIam, User } from '../../../utils/whoIam.ts'

let user: User | null

let showModal = ref(false);

let channels = ref([
	{ id: 1, name: 'channel_1' },
	{ id: 2, name: 'yjyj' },
	{ id: 3, name: 'svdsvdsv' },
	{ id: 4, name: 'sdvdsvdsv' },
	{ id: 5, name: 'sdvsdeygvuwygvewygvewygvewyvuewygvuewygvewyvuyguyv' },
	{ id: 6, name: 'sdvdsv' },
	{ id: 7, name: 'sdvdsv' },
	{ id: 8, name: 'sdvdsv' },
	{ id: 9, name: 'sdvdsvs' },
	{ id: 10, name: 'sdvdsv' },
	{ id: 11, name: '11' },
	{ id: 12, name: 'sdvdsv' },
	{ id: 13, name: 'sdvdsv' },
	{ id: 14, name: 'sdvdsv' },
	{ id: 15, name: 'sdvdsv' },
	{ id: 16, name: 'sdvdsv' },
	{ id: 17, name: 'sdvdsv' },
	{ id: 18, name: 'sdvdsv' },

])

async function getCurrUser() {
	user = await whoIam()
}

onBeforeMount(() => {
	getCurrUser().then( () => 
		fetch('http://' + import.meta.env.VITE_CURRENT_HOST + ':3000/chat/channels/' + user?.id, {
			method: 'GET',
			credentials: 'include'
		})
	)
	.then(response => response.json())
	.then(data => {
		console.log("channels:")
		console.log(data)
		// assign the received data to channels array (i haven't done it yet since i can't create channels yet so i can't really test -svenja)
	})
	.catch(error => console.error("ChatOverview Error:" + error.message))
})

</script>

<style scoped>

.channels {
	border-top: 1px solid white;
	border-bottom: 1px solid white;
	width: 100%;
	overflow-x: hidden;
	overflow-y: scroll;
}
.channel {
	border: 1px solid white;
    background-color: black;
    color: white;
    font-size: var(--font-size-sm);
	box-sizing: border-box;
    width: 100%;
	padding-top: 30px;
	padding-bottom: 10px;
    padding-left: 10px;
    display: block;
    margin: 0px;
    text-align: left;
	text-overflow: ellipsis;
	overflow: hidden;

	cursor: pointer;
}

.controls {
	display: flex;
	margin: 0;
	height: 100%;
}

button {
	font-size: var(--font-size-tiny);
	height: 100%;
	flex-grow: 1;
}

.commands {
	font-size: var(--font-size-tiny);
	margin-left: 10px;
}

p {
	text-align: left;
	margin-top: 10px;
	margin-bottom: 0px;
}

input {
	margin-top: 10px;
	margin-right: 10px;
	font-family: 'textfont';
	text-transform: uppercase;
	font-size: var(--font-size-tiny);
	height: 20px;
}

</style>