<template class="chat">
    <div class="chat">
        <h3>Chat</h3>
        <div class="messages_container" id="messages_container">
            <Message v-for="message in text_array" :message_name="message.message_name"
                :message_content="message.message_content" :from_myself="message.from_myself" />
        </div>
        <div class="controls">
            <textarea id="chat_textarea" name="chat_message" cols="auto" rows="auto" @keydown="handleEnter"></textarea>
            <button @click="addMessageToChat">send</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import Message from './Message.vue'
import { ref, onMounted, nextTick } from 'vue';

const userName = "ANITA_" + Math.round(Math.random() * 100); // change later
const userID = Math.round(Math.random() * 10); // change later

let text_array = ref([ // later get written text messages from this chat
    { message_name: "test", message_content: "Lorem Ipsum", from_myself: true },
]);

let socket: WebSocket;

interface IChatUser {
    id: number;
    socket?: WebSocket;
}
interface IUser {
    id?: number | undefined;
    name: string;
    twoFAenabled: boolean;
    image: string | undefined;
    token?: string | undefined;
    activeChats: string[];
}
interface IMessage {
    user: IUser;
    input: string;
    room: string;
    from_myself?: boolean;
}
enum EChannelType {
    PRIVATE,
    PUBLIC
}
interface IChannel {
    user: IUser;
    type: EChannelType;
    title: string;
}

onMounted(async () => {
    const userData = await getUserData();
    updateChatHistoryDisplay("inner circle", userData.pseudo);
    try {
        socket = new WebSocket('ws://localhost:9000');

        socket.addEventListener('open', (event) => {
            console.log("connection established");
            const authMsg = {
                event: 'connect',
                data: {
                    id: (getUserData() as any).id
                }
            };
            socket.send(JSON.stringify(authMsg));
        });

        socket.addEventListener('close', (event) => {
            console.log("connection closed");
        });

        socket.addEventListener('error', (event) => {
            console.error(event);
        });

        socket.addEventListener('message', (event) => {
            console.log('client socket listener: ', event)
        });
    }
    catch (error) {
        console.error("ws error: " + error);
    }
})

async function addMessageToChat() {
    const newChatMessage = document.getElementById("chat_textarea") as HTMLTextAreaElement;
    if (newChatMessage.value == '')
        return;
    const userData = await getUserData();
    const newItem = createIMessage(newChatMessage, userData);
    sendMessageToServer(newItem);
    pushToTextArray(newItem)
    newChatMessage.value = '';
    nextTick(() => messageContainerScrollToBottom());
}

function handleEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        addMessageToChat();
    }
}

async function getUserData() {
    const response = await fetch('http://localhost:3000/auth/whoIam', {
        method: 'GET',
        credentials: 'include',
    });
    const userData = JSON.parse(await response.text());
    return userData;
}

async function updateChatHistoryDisplay(channelName: string, userName: string) {
    const response = await fetch(`http://localhost:3000/chat/history/${channelName}`, {
        method: 'GET',
        credentials: 'include',
    });
    let rawMessages = await response.json();

    text_array.value = rawMessages.map((rawMessage: string) => {
        let [message_name, message_content] = rawMessage.split(': ');
        let from_myself = (userName == message_name);
        return { message_name, message_content, from_myself };
    });
    nextTick(() => messageContainerScrollToBottom());
}

function createIMessage(newChatMessage: HTMLTextAreaElement, userData: any) {
    const newItem: IMessage = {
        user: {
            id: userData.id,
            name: userData.pseudo,
            twoFAenabled: true,
            image: userData.avatar,
            token: "bla bla bla",
            activeChats: [
                "chat1",
                "chat2",
                "chat3"
            ]
        },
        input: newChatMessage.value,
        room: "inner circle",
    }
    return newItem;
}

function sendMessageToServer(newItem: IMessage) {
    const msg = {
        event: "message",
        data: newItem
    }
    socket.send(JSON.stringify(msg));
}

async function pushToTextArray(newItem: IMessage) {
    text_array.value.push({
        message_name: newItem.user.name,
        message_content: newItem.input,
        from_myself: true,
    });
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

