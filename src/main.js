import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeAuthSessionSync } from './utils/auth-session'
import './style.css'

const app = createApp(App)

app.use(router)

initializeAuthSessionSync()

app.mount('#app')
