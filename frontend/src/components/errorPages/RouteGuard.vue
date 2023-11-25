<template>
	<h2>
		❌ Not allowed ❌
	</h2>
	<div class="little-footer">
		you may need to
		<router-link to="/start" id="link">log in</router-link>
		to access this page
	</div>
	<img src="https://64.media.tumblr.com/f2bf4d2fd469accef2380d2ad110cd36/859317e910bd95d1-fb/s540x810/e9baff4edaa25bf2ad76f5228613c8a150b693b8.pnj" alt="Not allowed-image">
</template>
	
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
	
<style scoped>
h2 {
	margin-bottom: 0px;
}

.little-footer {
	font-family: 'textfont';
	text-align: center;
	margin-top: 1vh;
	margin-bottom: 4vh;
	font-size: var(--font-size-sm);
}

img {
	display: block;
	margin: 0 auto;
}

#link {
	color: rgb(207, 0, 0);
	text-decoration: none;
	font-weight: 900;
}

</style>