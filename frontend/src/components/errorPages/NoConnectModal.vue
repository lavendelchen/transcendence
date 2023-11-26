<template>
	<div class="background" @click.self="closeModal">
		<div class="modal">
			<h1>Error</h1>
			<p id="msg">Cannot connect to the backend <br> try again later</p>
		</div>
	</div>
</template>
	
<script setup lang="ts">
	const emit = defineEmits(['close'])

	function closeModal() {
		emit('close');
	}
</script>
	
<style scoped>
	.modal {
		width: 50vw;
		max-width: 380px;
		text-align: center;
		color: white;
		background: black;
		border: 2px solid white;
		padding: 40px;
		margin: 20vh auto;
		font-size: var(--font-size-sm);
		line-height: 200%;
	}

	.background {
		background: rgba(102, 96, 96, 0.7);
		width: 100vw;
		height: 100vh;
		top: 0;
		left: 0;
		position: fixed;
	}

	h1 {
		color: red;
	}

</style>