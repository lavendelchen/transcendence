<script setup lang="ts">
import Message from './Message.vue'
import {ref} from 'vue';

async function checkAuthenticated() {
    const response = await fetch('http://localhost:3000/auth/isAuthenticated', {
        method: 'GET',
        credentials: 'include',
    });
    const data = await response.text();
    console.log("buttoncheck: " + data);
}

let text_array = ref([
        {message_name: "test", message_content:"Lorem Ipsum", from_myself:true},
        {message_name: "test", message_content:"Lorem Ipsum", from_myself:false},
        {message_name: "test", message_content:"Lorem Ipsum", from_myself:true},
        {message_name: "test", message_content:"Lorem Ipsum", from_myself:true},
        {message_name: "test", message_content:"Lorem Ipsum", from_myself:false},
        {message_name: "test", message_content:"Lorem Ipsum", from_myself:true}
]);

// function addMessage() {
    // const newID = Date.now();
    // text_array.value.push(newID);
// }

var socket = new WebSocket('ws://localhost:8080/message');

socket.onopen = (ev) => {
    console.log('Socket opened: ', ev);
};
socket.onmessage = (m) => {
    let message = JSON.parse(m.data);
    console.log('Message:', message);
    const newItem = {
        message_name: JSON.parse(m.data.message_Name),
        message_content: JSON.parse(m.data.message.message_content),
        from_myself: false
    }
    text_array.value.push(newItem);

};
socket.onclose = (ev) => {
    console.log('Socket closed: ', ev);
};

const sendMessage = () => {
    // socket.send(
    // JSON.stringify(
        // {
            // type: 'create', 
            // path: 'message', 
            // data: {
                // message_name: 'Nico',
                // message_content: 'Das ist eine Testnachricht'
            // }
        // }
    // )
// )
}

function getUserName() {
    return "Nico";
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
        console.error("Elemnt with ID message_container could not be found");
    }
}

function addMessageToChat() {
    const newChatMessage = document.getElementById("chat_textarea") as HTMLTextAreaElement;
    if (newChatMessage.value == '')
        return;
    const newItem = {
        message_name: getUserName(),
        message_content: newChatMessage.value,
        from_myself: true,
    }
    text_array.value.push(newItem);
    newChatMessage.value = '';
    sendMessage();
    messageContainerScrollToBottom();
    checkAuthenticated();
}

</script>

<template class="chat">
<div class="chat">
    <h3>Chat</h3>
    <div class="messages_container" id="messages_container">
            <Message v-for="message in text_array" :message_name="message.message_name" :message_content="message.message_content" :from_myself="message.from_myself"/>
         
    </div>
    <div class="controls">
        <textarea id="chat_textarea" name="chat_message" cols="auto" rows="auto"></textarea>
        <button @click="addMessageToChat" >send</button>
    </div>
</div>

</template>

<style scoped>

@import "../assets/base.css";


div.chat {
    height: 100%;
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
    font-size: var(--font-size-sm);

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

