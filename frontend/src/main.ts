import './assets/main.css'

import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import App from './App.vue'
import StartPage from './components/StartPage.vue'
import PlayPage from './components/playPage/PlayPage.vue'
import LeaderboardPage from './components/LeaderboardPage.vue'
import Prompt from './components/Prompt.vue'
import OTP from './components/OTP.vue'
import RouteGuard from './components/errorPages/RouteGuard.vue'
import NotFound from './components/errorPages/NotFound.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/start', component: StartPage },
        { path: '/play', component: PlayPage },
        { path: '/leaderboard', component: LeaderboardPage },
		{ path: '/prompt', component: Prompt },
		{ path: '/OTP', component: OTP },
		{ path: '/not-allowed', component: RouteGuard },
        { path: '/', redirect: '/start'} ,
		{ path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
		{ path: '/:pathMatch(.*)', name: 'bad-not-found', component: NotFound },
    ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')