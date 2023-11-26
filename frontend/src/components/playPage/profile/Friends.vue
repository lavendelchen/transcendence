<template>

<p v-for="friendship in friends" :key="friendship.id" class="friend">
	<img @click="goToFriendProfile(friendship.followedUser.id)" :src="friendship.followedUser.avatar" alt="profile picture">
	<span @click="goToFriendProfile(friendship.followedUser.id)">{{ friendship.followedUser.pseudo }}</span>
	<span id="status" @click="goToFriendProfile(friendship.followedUser.id)">{{ showStatus(friendship.followedUser) }}</span>
	<button @click="removeFriend(friendship.id)">remove</button>
</p>
<p v-if="errorMsg" id="errorMsg"> {{ errorMsg }}</p>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { store } from '../../../store/store.ts'

const errorMsg = ref("");
const props = defineProps(['friends'])

onMounted(() => {
	getStatuses()
})

async function getStatuses() {
	try {
		const webSocket = new WebSocket('ws://' + import.meta.env.VITE_CURRENT_HOST + ':5174');

		webSocket.addEventListener('open', (event) => {
			const getStatusesMsg = {
				event: 'getStatuses',
				data: {
					friendships: props.friends
				}
			};
			webSocket.send(JSON.stringify(getStatusesMsg));
		});
		
		webSocket.addEventListener('message', handleMessage);

		webSocket.addEventListener('close', (event) => {
			console.log('connection closed');
		});
		webSocket.addEventListener('error', (event) => {
			console.error(event);
		});
	}
	catch (error) {
		console.error(error);
	}
}

function showStatus(friend: any) {
	if (!('status' in friend))
		return "🔴"
	else if(friend.status == "in_queue")
		return "🟡"
	else if(friend.status == "playing")
		return "🟢"
}

function handleMessage(event: MessageEvent<any>) {
	const message = JSON.parse(event.data);
	console.log(message)
	console.log(message.data.in_queue)
	console.log(message.data.playing)
	props.friends.forEach((friendship: any, index: number) => {
		if (-1 !=
			message.data.in_queue.findIndex((playerID: number) => {
			return playerID == friendship.followedUser.id
		})) {
			friendship.followedUser.status = "in_queue"
		}

		if (-1 !=
			message.data.playing.findIndex((playerID: number) => {
			return playerID == friendship.followedUser.id
		})) {
			friendship.followedUser.status = "playing"
		}
	});
}

function removeFriend(friendshipID: number) {
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
		// friendMsg.value = 'Add as friend'
		errorMsg.value = ""
		const toDeleteIndex = props.friends.findIndex((friendship: any) => {
		  return friendship.id === friendshipID
		})
		props.friends.splice(toDeleteIndex, 1)
	})
	.catch(error => {
		console.error(error)
		errorMsg.value = "Couldn't remove friend"
		return;
	});
}

function goToFriendProfile(friend_id: number) {
	console.log("hello? " + friend_id)
	store.foreignProfileID = friend_id;
	store.chatActive = false;
	store.profileActive = false;
	store.foreignProfileActive = true;
}

</script>

<style scoped>

p {
	/* border: 1px solid white; */
}

.friend {
	display: flex;
	align-items: center;
	transition: 0.3s;
}

.friend:hover {
	color: black;
	background-color: white;
}

img {
	width: 40px;
	height: 40px;
	object-fit: cover;
	border-radius: 50%;
	display: inline-block;
	vertical-align: middle;
	margin-right: 20px;
	margin-left: 30px;
	margin-top: 7px;	
	margin-bottom: 7px;

	cursor: pointer;
}

span {
	margin: 0;
	text-overflow: ellipsis;
	overflow: hidden;

	cursor: pointer;
}

#status {
	/* border: 1px solid white; */
	overflow: visible;
	font-size: var(--font-size-tiny);
	margin-left: auto;
	margin-right: 8px;
	padding: 5px;
}

button {
	font-size: var(--font-size-tiny);
	padding-left: auto;
}

#errorMsg {
	color: red;
}

</style>