<template>
	<form>
	  <ul>
		<li>
			<label>Change username</label>
			<input type="text" id="name" v-model="formData.pseudo" :class="{ 'error': formErrors.pseudo }" />
		</li>
		<li>
			<label>Change Profile Picture <br>(Insert link)</label>
			<input type="text" id="avatar" v-model="formData.avatar" :class="{ 'error': formErrors.avatar }" />
		</li>
		<li>
			<button @click="submit">
				Submit
			</button>
		</li>
		<li id="tfaBox">
		  <button type="button" id="tfa" @click="toggleTfa"> {{ tfaMsg }}</button>
		</li>
	  </ul>
	</form>
	<TFAModal v-if="showModal" :TFASecret="tfaSecret" @close="tfaDone"/>
	<p v-if="errorMsg" id="errorMsg"> {{ errorMsg }}</p>
	<p v-if="successMsg" id="successMsg"> {{ successMsg }}</p>
	</template>
	
	<script setup lang="ts">
	import TFAModal from '../TFAModal.vue'
	import { whoIam, User } from '../../utils/whoIam.ts'
	import { useRouter } from 'vue-router';
	import { ref, computed, onBeforeMount } from 'vue'
	
	const emit = defineEmits(['userDataChanged'])

	let user: User | null
	
	const router = useRouter();
	
	let formData = ref({
		pseudo: "",
		avatar: "",
	})
	
	let formErrors = ref({
		pseudo: false,
		avatar: false
	})
	
	let errorMsg = ref("");
	let successMsg = ref("");
	
	let showModal = ref(false);
	let tfaSecret = ref("");
	let tfaEnabled = ref(false);
	let tfaMsg = computed(() => 
		tfaEnabled.value ?
		"Disable Two-Factor Authentication" :
		"Enable Two-Factor Authentication"
	);
	
	onBeforeMount(() => {
		setTFAmsg()
	})
	
	async function setTFAmsg() {
		user = await whoIam()
		if (!user)
			router.push('/not-allowed')
		else if (user.is2FActive) {
				tfaEnabled.value = true;
		}
	}
	
	function tfaDone() {
		showModal.value = false;
		tfaEnabled.value = true;
		router.push('/otp')
	}
	
	function toggleTfa() {
		if (tfaEnabled.value)
			disableTFA()
		else
			enableTFA()
	}

	function disableTFA() {
		fetch('http://' + import.meta.env.VITE_CURRENT_HOST + ':3000/tfa/disableTfa/' + user?.id, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({})
		})
		.then(response => response.json())
		.then(data => {
			if ('statusCode' in data) {
				if (data.statusCode == 500) {
					errorMsg.value = "Couldn't disable TFA :("
					successMsg.value = ""
					return;
				}
			}
			else if ('message' in data) {
				if (data.message == 'TFA is already disable for the user.') {
					successMsg.value = ""
					errorMsg.value = "TFA is already disabled. something must have gone wrong"
					return;
				}
				else if (data.message == 'Unauthorized: Need to be logged in') {
					errorMsg.value = "you're not logged in somehow :/ can't update"
					successMsg.value = ""
					return;
				}
			}
			console.log("data: ")
			console.log(data)
			errorMsg.value = ""
			successMsg.value = "successfully disabled TFA!"
			tfaEnabled.value = false;
		})
		.catch(error => {
			errorMsg.value = "Couldn't disable TFA :("
			console.error('Error:', error)
		});
	}

	function enableTFA() {
		fetch('http://' + import.meta.env.VITE_CURRENT_HOST + ':3000/tfa/enableTfa/' + user?.id, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({})
		})
		.then(response => response.json())
		.then(data => {
			if ('statusCode' in data) {
				if (data.statusCode == 500) {
					errorMsg.value = "Couldn't enable TFA :("
					return;
				}
			}
			else if ('message' in data) {
				if (data.message == 'TFA is already enabled for the user.') {
					tfaSecret.value = "already"
					errorMsg.value = ""
					showModal.value = true
					return;
				}
				else if (data.message == 'Unauthorized: Need to be logged in') {
					errorMsg.value = "you're not logged in somehow :/ can't update"
					successMsg.value = ""
					return;
				}
			}
			console.log("data: ")
			console.log(data)
			tfaSecret.value = data.user.secretOf2FA
			errorMsg.value = ""
			successMsg.value = "successfully enabled TFA!"
			showModal.value = true
		})
		.catch(error => {
			errorMsg.value = "Couldn't enable TFA :("
			console.error('Error:', error)
		});
	}
	
	function isImageLoadable(url: string): Promise<any> {
	  // Check if the image can be loaded successfully
	  return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve(true);
		img.onerror = () => resolve(false);
		img.src = url;
	  });
	}
	
	async function submit(event: any) {
		event.preventDefault();
	
		if (!formData.value.pseudo && !formData.value.avatar) {
			errorMsg.value = "nothing changed"
			formErrors.value.pseudo = true;
			formErrors.value.avatar = true;
			return;
		  }

		if (formData.value.avatar) {
			var imageLoadable = Promise<any>;
			imageLoadable = await isImageLoadable(formData.value.avatar);
			  if (!imageLoadable) {
				  formData.value.avatar = "";
				errorMsg.value = "invalid profile picture link";
				formErrors.value.avatar = true;
				  return;
			}
		}
	
		errorMsg.value = "";
	
		var submitForm: any;
	
		if (formData.value.avatar && formData.value.pseudo)
			submitForm = formData.value
		else if (formData.value.avatar) {
			submitForm = {
				avatar: formData.value.avatar
			}
		}
		else if (formData.value.pseudo){
			submitForm = {
				pseudo: formData.value.pseudo
			}
		}
		else {
			console.error("How did we get here??")
		}
		fetch('http://' + import.meta.env.VITE_CURRENT_HOST + ':3000/user/' + user?.id, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(submitForm)
		})
		.then(response => response.json())
		.then(data => {
			if ('statusCode' in data) {
				if (data.statusCode == 500) {
					errorMsg.value = "Couldn't update user data :("
					return;
				}
			}
			console.log(data)
			successMsg.value = "successfully changed user data"
			formData.value.pseudo = ""
			formData.value.avatar = ""

			emit('userDataChanged')
		})
		.catch(error => {
			errorMsg.value = "Couldn't update user data :("
			console.error('Error:', error)
		});
	}
	
	</script>
	
	<style scoped>
	
	form {
		font-size: var(--font-size-sm);
		text-align: center;
	}
	
	form ul {
	  list-style-type: none; /* Remove bullets */
	  padding: 0; /* Remove default padding */
	  margin: 0; /* Remove default margin */
	}
	
	form li {
	  margin-bottom: 2vh; /* Add some spacing between list items */
	}
	
	form label {
	  display: block; /* Make labels block elements to stack them vertically */
	  margin-bottom: 1vh; /* Add spacing below labels */
	}
	
	input {
		padding: 6px;
	}

	
	button {
		margin: 0 auto;
	}

	#tfaBox {
		margin-top: 3vh;
	}
	
	#tfa {
		font-size: var(--font-size-tiny);
		border-width: 1px;
	}
	
	#errorMsg {
		color: red;
	}
	#successMsg {
		color: rgb(17, 148, 17);
	}
	
	.error {
	  border: 1px solid red;
	}
	
	</style>