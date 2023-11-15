<script setup lang="ts">
// import { useRouter } from 'vue-router';

// const router = useRouter();

async function startAuth() {
  
  try {
    const response = await fetch("http://localhost:3000/auth/isAuthenticated");
    const data = await response.text();
    console.log(data);
    if (data == 'true') {
      // router.push('/play');
      console.log("already authenticated");
      return;
    }
  } catch (error) {
    console.error("checking session storage failed", error);
  }
  
  try {
    const response = await fetch('http://localhost:3000/auth/init');
    const data = await response.text();
    console.log(data);
    window.location.href = data;
  } catch (error) {
    console.error("Init Authentication failed");
  }
}

// async function handleAuthCallback(code) {
//   const response = await fetch ('/auth?code${code}');
//   const data = await
// }

</script>

<template>
	<p id="score">
		Score: 3000p
	</p>
	<section class="logo">
		Ping&#160;&#160;&#160;&#160;&#160;&#160;&#160; <br>
		Pang <br>
		&#160;&#160;&#160;&#160;&#160;&#160;&#160;Pong
	</section>
	<!-- <a href="https://api."> -->
		<div @click="startAuth" class="buttonLogin">
			Login
		</div>
	<!-- </a> -->
    <RouterLink class="link-skipp-login" to="/play">Skip Login</RouterLink>
	<p class="copyrightFooter"> <!-- put this outside of router view maybe? -->
		&#169; The PingPangPong Company 2023 <br>
		All rights reserved
	</p>
</template>

<script lang="ts">

export default {
	data() {
		return {
			score: -1
		}
	},
	methods: {
	},
	mounted() {
		this.score = 3000; // FETCH from backend
	}
}

</script>

<style scoped>

a:link {
	color: white;
	text-decoration: none;
}

section {
	font-size: var(--font-size-xxxl);
	letter-spacing: 0px;
	line-height: calc(30px + 5vw);
	width: 100%;
	text-align: center;
	text-align: center;
	margin-top: 10vh;
}

.logo {
	font-family: 'Logofont';
}

body {
	font-family: 'textfont', sans-serif;
}

p {
	text-align: center;
	font-family: 'textfont', sans-serif;
}

img {
	width: 800px;
	display: block;
	margin: 20vh auto 0 auto;
}

    div.buttonLogin {
      display: block;
      margin: 10vh auto 0 auto;
      width: 100px;
      border: 1px solid white;
      text-align: center;
      padding: 10px 20px;
    }

.copyrightFooter {
	font-size: var(--font-size-sm);
	position: fixed;
	bottom: 0;
	display: block;
	left: 30vw;
	width: 40vw;
}

.leaderboard {
	margin: 0;
	font-size: var(--font-size-tiny);
}

.position {
	margin: 0;
	top: 7px;
	position: relative;
	color: tomato;
	font-family: 'logofont', sans-serif;
	font-size: var(--font-size-lg);
}
</style>