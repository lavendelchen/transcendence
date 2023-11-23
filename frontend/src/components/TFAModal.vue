<template>
	<div class="background" @click.self="closeModal">
		<div class="modal"> <!-- :class="tfa" -->
			<p id="msg" v-if="TFASecret != 'already'">This is your 2FA secret. You will need it next time you log in:</p>
			<p id="secret">{{ tfaMsg }}</p>
		</div>
	</div>
</template>
	
<script lang="ts">
	export default {
		props: [
			'TFASecret'
		],
		methods: {
			closeModal() {
				this.$emit('close');
			},
		},
		computed: {
    		tfaMsg() {
				console.log(this.TFASecret)
				if (this.TFASecret == "already")
    		  		return "You already have Two-Factor Authentication enabled."
				else
					return this.TFASecret
			}
		}
	}
</script>
	
<style scoped>
	.modal {
		width: 50vw;
		max-width: 300px;
		text-align: center;
		color: rgb(181, 181, 181);
		background: black;
		border: 2px solid white;
		padding: 40px;
		margin: 20vh auto;
		font-size: var(--font-size-sm);
		line-height: 200%;
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

	#msg {
		font-size: var(--font-size-tiny);
		line-height: 200%;
	}

	#secret{
		color: white;
		font-family: Arial, Helvetica, sans-serif;
		font-size: var(--font-size-md);
	}
</style>