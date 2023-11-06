

<script setup lang="ts">
import Chat from "./Chat.vue"
import Menue from "./Menue.vue"
import Profile from "./Profile.vue"
import Game from './Game.vue'

import { store } from '../store/store.ts'



</script>

<template>
    <!-- <h1>Playpage</h1> -->
    <div class="appbody">
        <main>
            <Game />
        </main>
        <aside>
            <Menue />
            <Chat v-if="store.chatActive" /> 
            <Profile v-if="store.profileActive" />
        </aside>
    </div>

</template>


<style scooped>



.appbody {
    background-color: black !important;
    display: grid;
    grid-template-columns: auto 30vw;
    grid-template-rows: 1fr;
    grid-column-gap: 20px;
    /* height: 100%; */
}

aside {
    width: 30vw;
    max-width: 400px;
    height: 100%;
    /* max-width: 500px; */
}

h1 {
    font-size: 2rem !important;
}



</style>