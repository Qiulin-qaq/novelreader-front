import { createApp } from 'vue'
import App from './App.vue'
import NavBar from '@/components/NavBar.vue'
import '@/assets/css/global.css'

const app = createApp(App)
app.component('NavBar', NavBar)
app.mount('#app')
