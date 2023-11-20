<!-- <template>
	<button @click="message">'message'</button>
	<button @click="join">'join'</button>
	<button @click="create">'create'</button>
</template>


<script setup lang="ts">
import { onMounted } from 'vue'
interface IChatUser {
	id: number;
	socket?: WebSocket;
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

let webSocket: WebSocket;

onMounted(() => {
	try {
		// webSocket = new WebSocket("ws://localhost:9000"); // use the port for your chat server!! if you can't find it ask me

		webSocket.addEventListener('open', (event) => {
			console.log("connection established");
			const authMsg = {
				event: 'connect',
				data: {
					id: 99484, // gjupys ID
				}
			};
			webSocket.send(JSON.stringify(authMsg));
		});
		webSocket.addEventListener('close', (event) => {
			console.log("connection closed");
			const authMsg = {
				event: 'disconnect',
				data: {
					id: 99484, // gjupys ID
				}
			};
			webSocket.send(JSON.stringify(authMsg));
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

let sendChannel: IChannel;
sendChannel = {
	user: {
		id: 99484,
		name: "gjupy",
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
		id: 99484,
		name: "gjupy",
		intraname: "gjupy",
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
		data: sendMessage
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
</style> -->