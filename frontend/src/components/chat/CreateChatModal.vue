<template>
	<div class="background" @click.self="closeModal">
		<div class="modal" @click="printtt">
			<select name="type" v-model="type">
				<option>public</option>
				<option>password-protected</option>
				<option>private</option>
			</select>
			<div class="password" v-if="type == 'password-protected'">
				<label>password</label>
				<input v-model="password">
			</div>
			<button @click="submit">
				Submit (nothing happening yet)
			</button>
			<p v-if="errorMsg && type == 'password-protected'" id="errorMsg"> {{ errorMsg }}</p>
		</div>
	</div>
</template>
	
<script lang="ts">
	export default {
		data() {
			return {
				type: "public",
				password: "",
				errorMsg: ""
			}
		},
		methods: {
			closeModal() {
				this.$emit('close')
			},
			printtt() {
				console.log(this.type)
				console.log(this.password)
			},
			submit() {
				if (this.type == 'password-protected' && !this.password) {
					this.errorMsg = "Please enter a password"
					return
				}
				this.closeModal()
				// MISSING STUFF -> DOESN'T ACTUALLY CREATE NEW CHAT
			},
		}
	}
</script>
	
<style scoped>
	.modal {
		width: 50vw;
		max-width: 300px;
		text-align: center;
		color: white;
		background: black;
		border: 2px solid white;
		padding: 40px;
		margin: 20vh auto;
		font-size: var(--font-size-tiny);
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

	select {
		font-size: var(--font-size-sm);
	}
	option {
		font-size: var(--font-size-sm);
		font-family: 'textfont';
		text-transform: uppercase;
	}
	label {
		margin-bottom: 10px;
		display: block;
	}
	.password {
		margin-top: 20px;
	}

	button {
		margin: 0 auto;
		margin-top: 30px;
		padding-top: 5px;
		padding-bottom: 5px;
	}

	#errorMsg {
		margin-top: 20px;
		color: red;
	}


</style>