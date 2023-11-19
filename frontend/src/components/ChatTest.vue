<template>
	<button @click="message">'message'</button>
	<button @click="join">'join'</button>
	<button @click="create">'create'</button>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
let webSocket: WebSocket;
onMounted(() => {
	try {
		webSocket = new WebSocket('ws://' + import.meta.env.VITE_CURRENT_HOST + ':9000'); // use the port for your chat server!! if you can't find it ask me

		webSocket.addEventListener('open', (event) => {
			console.log("connection established");
		});
		// webSocket.addEventListener('message', handleMessages);
		webSocket.addEventListener('close', (event) => {
			console.log("connection closed");
		});
		webSocket.addEventListener('error', (event) => {
			console.error(event);
		});
	}
	catch (error) {
		console.error(error);
	}
})
const userID = Math.round(Math.random() * 10);
const userName = "DUMMY_" + Math.round(Math.random() * 100);
enum EChannelType {
	PRIVATE,
	PUBLIC
}
interface IUser {
	id?: number | undefined;
	name: string | undefined;
	intraname: string | undefined;
	twoFAenabled: boolean;
	image: string | undefined;
	token?: string | undefined;
	activeChats: string[];
}
interface IMessage {
	user: IUser;
	input: string;
	room: string;
}
interface IChannel {
	user: IUser;
	type: EChannelType;
	title: string;
}
let sendChannel: IChannel;
sendChannel = {
	user: {
		id: 83414,
		name: "hngo",
		intraname: userName,
		twoFAenabled: true,
		image: "this is an image",
		token: "bla bla bla",
		activeChats: [
			"chat1",
			"chat2",
			"chat3"
		]
	},
	type: EChannelType.PRIVATE,
	title: "Room number one"
};
let sendMessage: IMessage;
sendMessage = {
	user: {
		id: userID,
		name: userName,
		intraname: userName,
		twoFAenabled: true,
		image: "this is an image",
		token: "bla bla bla",
		activeChats: [
			"chat1",
			"chat2",
			"chat3"
		]
	},
	input: "this is my message",
	room: "Room number one"
};
function message() {
	console.log("sendMessage:", sendMessage);
	const msg = {
		event: "message",
		data: {
			sendMessage
		}
	}
	webSocket.send(JSON.stringify(msg));
};
function join() {
	console.log("sendChannel:", sendChannel);
	const msg = {
		event: "join",
		data:
			sendChannel
	}
	webSocket.send(JSON.stringify(msg));
};
function create() {
  try {
    const msg = {
      event: "create",
      data: 
        sendChannel,
    };
    console.log("Sending message:", msg);
    webSocket.send(JSON.stringify(msg));
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
</script>

<style scoped>
button {
	margin: 40px;
}
</style>