<script setup lang=ts>
import { store } from '../store/store.ts';

    function chatButtonClicked() {
        console.log('button clicked')
		if (store.chatActive == false) {
        	store.profileActive = false;
        	store.chatActive = true;
		}
		else {
			store.profileActive = false;
        	store.chatActive = false;
		}
    }
    
    function profileButtonClicked() {
        console.log('button clicked')
        if (store.profileActive == false) {
        	store.profileActive = true;
        	store.chatActive = false;
		}
		else {
			store.profileActive = false;
        	store.chatActive = false;
		}
    }
    
    function logoutButtonClicked() {
        console.log('button clicked')
    }

</script>

<template>
    <div class="menue">
        <div @click="chatButtonClicked()" class="button">
            <img src="../assets/img/chat.svg" alt="CHAT">
        </div>
        <div @click="profileButtonClicked()" class="button">
            <img src="../assets/img/profile.svg" alt="PROFILE">
        </div>
        <div @click="logoutButtonClicked()" class="button">
            <img src="../assets/img/logout.svg" alt="LOGOUT">
        </div>
    </div>
</template>

<style scooped>

.menue {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    height: 10vh;
    width: 100%;
    /* border: 0.5px solid white; */
    justify-content: space-evenly;
    grid-gap: 20px;
    
}
 .button {
    height:auto;
    width: auto;
    max-width: 100px;
    max-height: 100px;
    justify-content: center;
    align-items: center;
  padding: 10px 10px;
  position: relative;
  background: white;
  z-index: 2;
  position: relative;
  display: block;
  font-family: 'VT323';
  text-transform: uppercase;
  font-size: 25px;
  color: black;
  margin: 10px;
  font-family: 'VT323';
  position: relative;
  display: inline-block;
  vertical-align: top;
  text-transform: uppercase;
  cursor: pointer;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  place-items: center;
 }

 .button::before {
    content: "";
  display: block;
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: -10px;
  right: -10px;
  background: white;
  z-index: -1;
}

.button::after {
    content: "";
  display: block;
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: -6px;
  right: -6px;
  background: white;
  z-index: -1;
}

.button img {
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.button:active {
    top: 4px;
}

</style>