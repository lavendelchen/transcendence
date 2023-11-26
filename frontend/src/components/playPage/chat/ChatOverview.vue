<template>
	<div class="channels" v-if="channels.length > 0">
		<div v-for="channel in channels" :key="channel.id"  @click="$emit('join', channel)" class="channel">
			{{ channel.name }}
		</div>
	</div>
	<div class="controls">
		<button @click="newChannel()">Create Channel</button>
		<div class="commands">
			<p>New channel name </p>
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
	{ id: 1, name: 'dummy_channel' },
])

async function getCurrUser() {
	user = await whoIam()
}


async function newChannel() {
	// const newChannel = 

// 	createChannelOnServer(newChannel)
}

onMounted(() => {
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
	
		let id = 0
		channels.value.pop()
		for (let channel in data){
			channels.value.push({id: id, name: data[channel]})
			// console.log("channel :", channel)
			// console.log("data.channel :", data.channel)
			// console.log("data[channel] :", data[channel])
			// console.log("data[id] :", data[id])
			// console.log("id :", id)
			id++;
		}
		
		const directMessageUser = fetch('http://' + import.meta.env.VITE_CURRENT_HOST + ':3000/user', {
				method: 'GET',
				credentials: 'include'
		})
		
		// for ( let i in directMessageUser) {
		// 	channels.value.push({ id: directMessageUser[i + id]., name: data[id + i] })
		// }
		
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
	transition: 0.3s;
}

.channel:hover {
	color: black;
	background-color: white;
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