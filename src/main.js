import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from '@/router'
import {createPinia} from 'pinia'
import {createPersistedState} from 'pinia-plugin-persist'

const pinia = createPinia()
const app = createApp(App)
const persist = createPersistedState()
pinia.use(persist)
app.use(ElementPlus)
app.use(router)
app.use(pinia)
app.mount('#app')
