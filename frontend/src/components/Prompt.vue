<template>
<h2>
	Account setup
</h2>
<div class="little-footer">Please enter your information</div>
<form>
  <ul>
    <li>
        <label>Username [optional]</label>
        <input type="text" id="name" v-model="formData.pseudo" :class="{ 'error': formErrors.pseudo }" />
    </li>
    <li>
		<label>Profile Picture (Insert link) [optional]</label>
		<input type="text" id="avatar" v-model="formData.avatar" :class="{ 'error': formErrors.avatar }" />
    </li>
	<li>
	  <button type="button" id="tfa" @click="enableTFA"> {{ tfaMsg }}</button>
	</li>
	<li>
		<button @click="submit">
			Submit
		</button>
	</li>
  </ul>
</form>
<TFAModal v-if="showModal" :TFASecret="tfaSecret" @close="tfaDone"/>
<p v-if="errorMsg" id="errorMsg"> {{ errorMsg }}</p>
<p v-if="successMsg" id="successMsg"> {{ successMsg }}</p>
</template>

<script setup lang="ts">
import TFAModal from './TFAModal.vue'
import { whoIam, User } from '../utils/whoIam.ts'

import { useRouter } from 'vue-router';
import { ref, onUpdated, onBeforeMount } from 'vue'

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
let tfaMsg = ref("Enable Two-Factor Authentication")

onBeforeMount(() => {
	setTFAmsg()
})

async function setTFAmsg() {
	user = await whoIam()
	if (!user)
		router.push('/not-allowed')
	else if (user.is2FActive)
			tfaMsg.value = 'TFA already enabled ✅'
}

function tfaDone() {
	showModal.value = false
	tfaMsg.value = 'TFA Enabled ✅'
}

function enableTFA() {
	fetch('http://' + import.meta.env.VITE_CURRENT_HOST + ':3000/tfa/enableTfa/' + user?.id, {
		method: 'POST',
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
		}
		console.log(data)
		tfaSecret.value = data.user.secretOf2FA
		errorMsg.value = ""
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
		/* errorMsg.value = "need some input to submit lol"
		formErrors.value.pseudo = true;
		formErrors.value.avatar = true; */
		redirectUs("No user data changed. Redirecting to game page!");
		return;
  	}

	if (formData.value.avatar) {
		var imageLoadable = Promise<any>;
		imageLoadable = await isImageLoadable(formData.value.avatar);
  		if (!imageLoadable) {
  			formData.value.avatar = "";
			errorMsg.value = "invalid profile picture link";
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
	fetch('http://' + import.meta.env.VITE_CURRENT_HOST + ':3000/user/' + user?.id, { // ADD ID
		method: 'POST',
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
		redirectUs("Successfully set user data! Redirecting to game :)")
	})
	.catch(error => {
		errorMsg.value = "Couldn't update user data :("
		console.error('Error:', error)
	});
}

function redirectUs(msg: string) {
	successMsg.value = msg
	setTimeout(() => router.push('/play'), 2500)
}

onUpdated(() => {
	console.log(formData.value.pseudo)
	console.log(formData.value.avatar)
})

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
  margin-bottom: 4vh; /* Add some spacing between list items */
}

form label {
  display: block; /* Make labels block elements to stack them vertically */
  margin-bottom: 2vh; /* Add spacing below labels */
}

input {
	padding: 6px;
}

h2 {
	margin-bottom: 0px;
}

button {
	margin: 0 auto;
}
.little-footer {
	font-family: 'logofont';
	text-align: center;
	margin-top: 0px;
	margin-bottom: 4vh;
	font-size: var(--font-size-base);
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