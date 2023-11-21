<template>
	<div class="channels" v-if="channels.length > 0">
		<div v-for="channel in channels" :key="channel.id"  @click="$emit('join', channel)" class="channel">
			{{ channel.name }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

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

onMounted(() => {
	fetch('http://' + import.meta.env.VITE_CURRENT_HOST + ':3000/chat/channels/1') // ADD ID!!
	.then(response => response.json())
	.then(data => {
		console.log(data)
	})
	.catch(error => console.log(error.message))
})

</script>

<style scoped>

.channels {
	width: 100%;
	overflow: hidden;
}
.channel {
	border-top: 2px solid black;
    background-color: rgb(193, 193, 193);
    color: black;
    font-size: var(--font-size-sm);
	box-sizing: border-box;
    width: 100%;
	padding-top: 30px;
	padding-bottom: 10px;
    padding-left: 10px;
    display: block;
    margin: 0;
    text-align: left;
	text-overflow: ellipsis;
	overflow: hidden;

	cursor: pointer;
}

</style>