<template>
  <p>{{ msg }}</p>
  <StartPage/>
  <button @click="alertModal(0)">ALERT ALERT</button>
  <button @click="chillModal(1)">let's just chill</button>
  <Modal v-if="modals[0].showModal" @close="closeModal(0)" :theme="modals[0].modalTheme">
    <h3>being so normal</h3>
		<p>is not normal</p>
    <p>is not normal</p>
    <p>is not normal</p>
    <p>is not normal</p>
    <template v-slot:image>
      <img src="https://images.genius.com/avatars/medium/e5d93961bf0220215079dc3cbf5e186d"/>
    </template>
  </Modal>
  <Modal v-if="modals[1].showModal" @close="closeModal(1)" :theme="modals[1].modalTheme">
    <h3>beautiful meadows grace your touch</h3>
    <p>they will guide you home.</p>
    <template v-slot:image>
      <img src="https://64.media.tumblr.com/9a3c8903d90340887d11e2bcc69f248f/4400ba68d9c3ab3e-68/s400x600/a4915ad43c4d214e629ca8de132c5b353a22b231.jpg"/>
    </template>
  </Modal>
</template>

<script>
  import './assets/main.css'
  import StartPage from "./components/StartPage.vue"
  import PlayPage from "./components/PlayPage.vue"
  import Modal from "./components/Modal.vue"

  export default {
    name: 'App',
    components: {
      StartPage,
      PlayPage,
      Modal,
    },
    data() {
      return {
        msg: 'lmaoo get recked',
        modals: [
          {
            showModal: false,
            modalTheme: 'none'
          },
          {
            showModal: false,
            modalTheme: 'none'
          },
        ],
      }
    },
    methods: {
      alertModal(modal) {
        this.modals[modal].modalTheme = "alert";
        this.modals[modal].showModal = true;
      },
      chillModal(modal) {
        this.modals[modal].modalTheme = "meadow";
        this.modals[modal].showModal = true;
      },
      closeModal(modal) {
        this.modals[modal].showModal = false;
      },
    },
  }
</script>

<style>
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

button {
  display: block;
  text-align: center;
  margin: 10vh auto 0 auto;
}
</style>
