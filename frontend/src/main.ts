import './assets/main.css'

import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import App from './App.vue'
import StartPage from './components/StartPage.vue'
import PlayPage from './components/PlayPage.vue'
import LeaderboardPage from './components/LeaderboardPage.vue'
import Prompt from './components/Prompt.vue'
import OTP from './components/OTP.vue'
import RouteGuard from './components/RouteGuard.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/start', component: StartPage },
        { path: '/play', component: PlayPage },
        { path: '/leaderboard', component: LeaderboardPage },
		{ path: '/prompt', component: Prompt },
		{ path: '/OTP', component: OTP },
		{ path: '/not-allowed', component: RouteGuard },
        { path: '/', redirect: '/start'} 
    ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')