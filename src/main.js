

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia';
import NavBar from '@/components/NavBar.vue'
import '@/assets/css/global.css'//引入使得全局生效
import router from './router'; 
const app = createApp(App)
const pinia = createPinia();


app.component('NavBar', NavBar)
app.use(pinia);//用于管理全局状态
app.use(router); 
app.mount('#app')
