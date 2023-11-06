

<script setup lang="ts">
import Chat from "./Chat.vue"
import Menue from "./Menue.vue"
import Profile from "./Profile.vue"

import { store } from '../store/store.ts'



</script>

<template>
    <!-- <h1>Playpage</h1> -->
    <div class="appbody">
        <main>
            
        </main>
        <aside>
            <Menue />
            <Chat v-if="store.chatActive" /> 
            <Profile v-if="store.profileActive" />
        </aside>
    </div>

</template>

<script lang="ts">
import Game from './Game.vue'

export default {
	components: {
		Game
	}
}
</script>

<style scooped>



.appbody {
    background-color: black !important;
    display: grid;
    grid-template-columns: auto 30vw;
    grid-template-rows: 1fr;
    grid-column-gap: 20px;
}

aside {
    width: 30vw;
    height: 80vw;
}

h1 {
    font-size: 2rem !important;
}



</style>