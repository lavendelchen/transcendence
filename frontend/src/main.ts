import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import StartPage from './components/StartPage.vue'
import PlayPage from './components/PlayPage.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/start', component: StartPage },
        { path: '/play', component: PlayPage },
        { path: '/', redirect: () => ({path: '/start'})} 
    ]
})

const app = createApp(App)
app.use(router);
app.mount('#app')