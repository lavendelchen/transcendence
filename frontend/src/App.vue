<script setup lang="ts">
</script>

<template>
	<router-view/>
	<p class="copyrightFooter"> <!-- put this outside of router view maybe? -->
		&#169; The PingPangPong Company 2023 <br>
		All rights reserved
	</p>
</template>

<style>

@import "./assets/base.css";

@font-face {
    font-family: 'textfont';
    src: url('/fonts/Pixeled.ttf');
}
@font-face {
  font-family: 'logofont';
  src: url('/fonts/gameboy.ttf');
}

body {
  font-family: 'textfont', sans-serif;
  background-color: black !important;
}

p {
  font-family: 'textfont', sans-serif;
  text-align: center;
}

h1 {
  font-family: 'logofont';
  text-align: center;
  font-size: var(--font-size-xl);
}
h2 {
  font-family: 'logofont';
  text-align: center;
  font-size: var(--font-size-lg);
}
h3 {
  font-family: 'logofont';
  text-align: center;
  font-size: var(--font-size-md);
}

button {
	font-family: 'textfont';
	text-transform: uppercase;
	display: block;
	background-color: black;
	color: white;
	border: 2px solid white;
	text-align: center;
	transition: 0.3s;
	padding: 10px;
}

button:hover {
	background-color: white;
	color: black;
}

.copyrightFooter {
	font-size: var(--font-size-tiny);
	position: fixed;
	bottom: 0;
	display: block;
	left: 15vw;
	width: 70vw;
	z-index: -1;
}

</style>
