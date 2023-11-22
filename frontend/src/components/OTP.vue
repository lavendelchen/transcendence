<template>
	<h2>
		Enter your one-time password
	</h2>
	<div class="little-footer">after generating a one-time password in google authenticator or similar</div>
	<form>
		<ul>
			<li>
				<input type="text" id="otp" v-model="formData.otp" :class="{ 'error': formErrors.otp }" />
			</li>
			<li>
				<button @click="submit">
					Submit
				</button>
			</li>
		</ul>
	</form>
	<p v-if="errorMsg" id="errorMsg"> {{ errorMsg }}</p>
	<p v-if="successMsg" id="successMsg"> {{ successMsg }}</p>
</template>
	
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, onUpdated } from 'vue'

const router = useRouter();

let formData = ref({
	otp: "",
})

let formErrors = ref({
	otp: false
})

let errorMsg = ref("");
let successMsg = ref("");

async function submit(event: any) {
	event.preventDefault();

	if (!formData.value.otp) {
		formErrors.value.otp = true
		errorMsg.value = "please enter your one-time password"
		return
	}

	errorMsg.value = "";

	var submitForm = {
		userId: 1, // SET USER ID
		otp: formData.value.otp
	}

	fetch('http://localhost:3000/tfa/verifyTfa', {
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
					errorMsg.value = "Couldn't verify OTP :("
					return;
				}
			}
			switch (data.message) {
				case 'TFA is not enabled for the user.':
					redirectUs("You don't actually have TFA enabled lol. Redirecting to game :)")
					return
				case 'TFA OTP is invalid.':
					errorMsg.value = "OTP is invalid"
					formErrors.value.otp = true
					formData.value.otp = ""
					return
				case 'TFA OTP is valid.':
					redirectUs("OTP verified! let's game :D")
					return
				default:
					errorMsg.value = "Unprecedented error faced"
					return
			}
		})
		.catch(error => {
			errorMsg.value = "Couldn't verify OTP :("
			console.error('Error:', error)
		});
}

function redirectUs(msg: string) {
	successMsg.value = msg
	setTimeout(() => router.push('/play'), 2500)
}

onUpdated(() => {
	console.log(formData.value.otp)
})

</script>
	
<style scoped>
form {
	font-size: var(--font-size-sm);
	text-align: center;
}

form ul {
	list-style-type: none;
	/* Remove bullets */
	padding: 0;
	/* Remove default padding */
	margin: 0;
	/* Remove default margin */
}

form li {
	margin-bottom: 4vh;
	/* Add some spacing between list items */
}

form label {
	display: block;
	/* Make labels block elements to stack them vertically */
	margin-bottom: 2vh;
	/* Add spacing below labels */
}

input {
	font-family: 'textfont';
	text-transform: uppercase;
}

h2 {
	margin-bottom: 0px;
}

button {
	margin: 0 auto;
}

.little-footer {
	font-family: 'textfont';
	text-align: center;
	margin-top: 1vh;
	margin-bottom: 4vh;
	font-size: var(--font-size-sm);
}

#errorMsg {
	color: red;
}

#successMsg {
	color: rgb(17, 148, 17);
}

.error {
	border: 1px solid red;
}</style>