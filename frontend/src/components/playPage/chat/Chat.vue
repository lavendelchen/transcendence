<template class="chat">
    <div class="chat" :style="{ 'grid-row-gap': chatActive ? '10px' : '0px' }">
		<img v-if="chatActive" src="https://static.thenounproject.com/png/1507912-200.png" alt="leave"
			@click="leaveChannel">
        <h3> {{ chatHeader }}</h3>

        <ActiveChat v-if="chatActive" :chat_id="activeChat.chat_id" :chat_name="activeChat.chat_name"/>

		<ChatOverview v-if="!chatActive" class="chatOverview" @join="joinChannel"/>

    </div>
</template>

<script setup lang="ts">
import ActiveChat from './ActiveChat.vue'
import ChatOverview from './ChatOverview.vue'
import { ref, onMounted } from 'vue'

let chatHeader = ref("Chat")

let chatActive = ref(false)

let activeChat = ref({
	chat_id: 0,
	chat_name: ""
})

function joinChannel(channel: any) {
	activeChat.value.chat_id = channel.id
	activeChat.value.chat_name = channel.name
	chatHeader.value = channel.name
	chatActive.value = true
}

function leaveChannel() {
	chatHeader.value = "Chat"
	chatActive.value = false
}

</script>

<style scoped>
@import "../../../assets/base.css";


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
    /* grid-template-rows: auto auto auto 1fr; */
	grid-template-rows: 80px auto 80px;
    grid-column-gap: 0px;
    grid-row-gap: 10px;
	overflow: hidden;
}

h3 {
    padding: 10px 10px 10px 10px;
    border-radius: 6px;
    height: 2rem;
    width: auto;
    margin: 10px 10px 10px 10px;
	text-overflow: ellipsis;
	overflow: hidden;
}

.chatOverview {
	margin-left: 3px;
	overflow: scroll;
}

img {
	background-color: white;
	position: absolute;
	width: 30px;
	height: 30px;
	object-fit: cover;
	border-radius: 8px;
	margin-left: 0.5vw;
	margin-top: 0.5vw;

	cursor: pointer;
}

</style>

