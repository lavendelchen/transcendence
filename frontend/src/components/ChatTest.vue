<template>
	<button @click="message">'message'</button>
	<button @click="join">'join'</button>
	<button @click="create">'create'</button>
</template>

<script setup lang="ts">

import { onMounted } from 'vue'
import { io } from "socket.io-client"

let socket: any;

onMounted(() => {
	try {
		socket = io("ws://localhost:9000") // use the port for your chat server!! if you can't find it ask me

		socket.on("connect", () => {
			console.log("connection established");
		})
		socket.on("disconnect", (reason: string) => {
			console.log("connection closed because:")
			console.log(reason)
		});
		socket.io.on("error", (error: Error) => {
			console.error(error)
		})
		socket.on("connect_error", (error: Error) => {
		  console.error(error)
		});
		// // webSocket.addEventListener('message', handleMessages);
	}
	catch(error) {
		console.error(error)
	}
})

const	userID = Math.round(Math.random()*10);
const	userName = "DUMMY_" + Math.round(Math.random()*100);

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
	type: EChannelType.PRIVATE,
	title: "Room number one"
}
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
}

function message() {
	console.log("sending MESSAGE")
	socket.emit("message", sendMessage, (response: any) => {
		console.log("Server response: " + response)
	})
};

function join() {
	console.log("sending JOIN")
	socket.emit("join", sendMessage, (response: any) => {
		console.log("Server response: " + response)
	})
};

function create() {
	console.log("sending CREATE")
	socket.emit("create", sendMessage, (response: any) => {
		console.log("Server response: " + response)
	})
};

</script>

<style scoped>
button {
	margin: 40px;
}
</style>