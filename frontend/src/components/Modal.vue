<template>
<div class="background" @click.self="closeModal">
	<div class="modal" :class="{ alert: theme === 'alert', meadow: theme === 'meadow' }">
		<slot>
			<p>this is a slot.</p>
		</slot>
		<div class="image">
			<slot name="image">
				<p>no image passed</p>
			</slot>
			<h6>best image on planet earth</h6>
		</div>
	</div>
</div>
</template>

<script>
	export default {
		props: [
			'header',
			'content',
			'number', 
			'theme',
		],
		methods: {
			closeModal() {
				this.$emit('close');
			},
		},
	}
</script>

<style scoped>
	.modal {
		width: 400px;
		text-align: center;
		background: rgb(255, 192, 203);
		border-radius: 20px;
		padding: 100px;
		margin: 500px auto;
	}
	.background {
		background: rgba(102, 96, 96, 0.7);
		width: 100%;
		height: 100%;
		top: 0;
		position: fixed;
	}
	h3 {
		color: rgb(226, 43, 211);
	}
	.alert {
		background-color: rgb(0, 0, 0);
	}
	.alert h3 {
		color: red;
	}
	.meadow {
		background-color: rgb(11, 124, 19);
		color: rgb(255, 255, 255);
	}
	.meadow h3 {
		color: rgb(255, 200, 0);
	}
	.image {
		color: rgb(164, 164, 164);
	}
</style>

