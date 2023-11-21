<template class="chat">

<div class="chat">
    <h3>Chat</h3>
    <div class="messages_container" id="messages_container">
            <Message v-for="message in text_array" :message_name="message.message_name" :message_content="message.message_content" :from_myself="message.from_myself"/>
    </div>
    <div class="controls">
        <textarea
			id="chat_textarea"
			name="chat_message"
			cols="auto" rows="auto"
			@keydown="handleEnter"
		></textarea>
        <button @click="addMessageToChat" >send</button>
    </div>
</div>

</template>

<script setup lang="ts">

import Message from './Message.vue'
import { ref, onMounted, nextTick } from 'vue';

const	userName = "ANITA_" + Math.round(Math.random()*100); // change later
const	userID = Math.round(Math.random()*10); // change later

let text_array = ref([ // later get written text messages from this chat
    {message_name: userName, message_content: "Lorem Ipsum", from_myself: true},
    {message_name: "chatter", message_content: "Lorem Ipsum", from_myself: false},
    {message_name: userName, message_content: "Lorem Ipsum", from_myself: true},
    {message_name: userName, message_content: "Lorem Ipsum", from_myself: true},
    {message_name: "chatter", message_content: "If you’re like me and you have the debilitating habit of beating yourself up over things, look yourself in the mirror and just go “I am young and I am allowed to make mistakes. It’s not that serious.” Bc it really isn’t. It is not that serious at all. This is not our second time living. We did not have a rehearsal for what the correct way to live is. This is our first time and we are allowed to stumble. It’s fine. It’s not that serious. ", from_myself: false},
	{message_name: "chatter", message_content: "Lorem Ipsum", from_myself: false},
	{message_name: "chatter", message_content: "Lorem Ipsum", from_myself: false},
    {message_name: userName, message_content: "Lorem Ipsum", from_myself: true}
]);

let webSocket: WebSocket;

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
let channelToSend: IChannel;
channelToSend = {
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
};
let messageToSend: IMessage;
messageToSend = {
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

onMounted(() => {
	try {
		webSocket = new WebSocket('ws://' + import.meta.env.VITE_CURRENT_HOST + ':9000');

		webSocket.addEventListener('open', (event) => {
			console.log("connection established");
		});
		webSocket.addEventListener('message', handleSocketMessages);
		webSocket.addEventListener('close', (event) => {
			console.log("connection closed");
		});
		webSocket.addEventListener('error', (event) => {
			console.error(event);
		});

		messageContainerScrollToBottom()
	}
	catch (error) {
		console.error(error);
	}
})

function handleSocketMessages(event: MessageEvent<any>) {
	const message = JSON.parse(event.data);
	console.log('Message:', message);

    const newItem = {
        message_name: message.message_Name,
        message_content: message.message_content,
        from_myself: false
    }
    text_array.value.push(newItem);

	// switch (message.event) {
	// 	case 'caseOne':
	// 		break;
	// }
}

function handleEnter(event: KeyboardEvent) {
	if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        addMessageToChat();
    }
}

function addMessageToChat() {
    const newChatMessage = document.getElementById("chat_textarea") as HTMLTextAreaElement;
    if (newChatMessage.value == '')
        return;

    const newItem = {
        message_name: userName,
        message_content: newChatMessage.value,
        from_myself: true,
    }
    text_array.value.push(newItem);

    sendMessage(newChatMessage.value);

    newChatMessage.value = '';
	nextTick(() => messageContainerScrollToBottom());
    //checkAuthenticated();
}

function sendMessage(input: string) {
	messageToSend.input = input

	webSocket.send(
		JSON.stringify(
			{
				event: 'message',
				data: messageToSend
			}
		)
	);
}

function messageContainerScrollToBottom() {
    const container = document.getElementById("messages_container");
    if (container) {
        console.log("before Scroll Height: " + container.scrollHeight);
        console.log("before ScrollTop: " + container.scrollTop);
        container.scrollTop = container.scrollHeight - container.clientHeight;
        container.scrollTop = container.scrollHeight - container.clientHeight;
        console.log("aftert Scroll Height: " + container.scrollHeight);
        console.log("after ScrollTop: " + container.scrollTop);
    } else {
        console.error("Element with ID message_container could not be found");
    }
}

// function addMessage() { //svenja: ??
//     const newID = Date.now();
//     text_array.value.push(newID);
// }

function checkAuthenticated() { // svenja: not sure how this function works with the session/cookie. but i kinda get it i guess
   fetch('http://' + import.meta.env.VITE_CURRENT_HOST + ':3000/auth/isAuthenticated', {
        method: 'GET',
        credentials: 'include',
    })
	.then(response => response.json())
	.then(data => {
		console.log("buttoncheck: " + data);
	})
    .catch(error => console.error('Error:', error));
}

</script>

<style scoped>

@import "../assets/base.css";


div.chat {
    height: 80vh;
    width: 100%;
    border: 0.2px solid lightgray;
    position: relative;
    right: 0;
    top: 0;
    margin-top: 2vh;
    margin-right: 30px;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 80px auto 80px;
    grid-column-gap: 0px;
    grid-row-gap: 10px
    
}

h3 {
    padding: 10px 10px 10px 10px;
    border-radius: 6px;
    height: 2rem;
    width: auto;
    margin: 10px 10px 10px 10px;
}

.messages_container {
    margin: 0px 10px;
    overflow-y: scroll;
	white-space: pre-line;
}

.controls {
    /* background-color: lightblue; */
    display: grid;
    grid-template-columns: auto 80px;
    grid-column-gap: 10px;
    margin: 0px 10px;
    margin-bottom: 10px;

}

textarea {
    resize: none;
    height: auto;
    width: 100%;
    background-color: #787878;
    color: white;
    outline: none;
    border: none;
    font-family: textfont;
    text-transform: uppercase;
    font-size: var(--font-size-tiny);

}

button {
    border: none;
    background: white;
    font-family: textfont;
    text-transform: uppercase;
    font-size: 12px;
    cursor: pointer;
    outline: none;
}

button:active {
    margin-top: 8px;
}


</style>

