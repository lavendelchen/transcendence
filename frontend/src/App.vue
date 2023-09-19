<script setup>
</script>

<template>
  <router-view></router-view>
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
  font-size: 500px !important;
}
</style>
