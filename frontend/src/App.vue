<script setup lang="ts">
</script>

<template>
	<router-link to="/start">Start Page</router-link> <br>
	<router-link to="/play">Play Game</router-link>
	<router-view/>
</template>

<style scoped>
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
}

p {
  font-family: 'textfont', sans-serif;
}

h1 {
  font-family: 'logofont';
}
</style>
