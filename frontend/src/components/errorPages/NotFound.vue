<template>
	<h2>
		404 not found
	</h2>
	<div class="little-footer">
		this route doesn't exist. <br> go to
		<router-link to="/start" id="link">start page</router-link>
	</div>
	<img src="./catcat.jpg" alt="Not allowed-image">
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
	margin-bottom: 2vh;
	font-size: var(--font-size-sm);
	line-height: 30px;
}

img {
	display: block;
	margin: 0 auto;
}

#link {
	color: rgb(164, 164, 164);
	text-decoration: none;
	font-weight: 900;
}

</style>