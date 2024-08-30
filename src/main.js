

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'

import router from '@/router'
import { createPinia } from 'pinia'
import piniapersist from 'pinia-plugin-persist'

const pinia = createPinia()


pinia.use(piniapersist)
const app = createApp(App)
app.use(router)
app.use(ElementPlus)

app.use(pinia)
app.mount('#app')
