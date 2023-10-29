

<script setup lang="ts">
import Chat from "./Chat.vue"


</script>

<template>
    <h1>Playpage</h1>
    <main>
        
    </main>
    <aside>
        <Chat /> 
    </aside>

</template>

<style scooped>



.appbody {
    background-color: black !important;
    display: grid;
    grid-template-columns: auto 30vw;
    grid-template-rows: 1fr;
    grid-column-gap: 20px;
}

h1 {
    font-size: 2rem !important;
}



</style>