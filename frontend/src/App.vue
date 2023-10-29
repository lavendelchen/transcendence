<script setup lang="ts">
</script>

<template>
  <router-view/>
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
}

h1 {
  font-family: 'logofont';
  font-size: 500px !important;
}
</style>
