

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia';

import piniaPersist from 'pinia-plugin-persist'
import '@/assets/css/global.css'//引入使得全局生效
import router from './router';
import ElementPlus from 'element-plus'
import "element-plus/dist/index.css";
import { setupRouterGuard } from './router/guard';

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPersist)

app.use(ElementPlus)
app.use(pinia);//用于管理全局状态
app.use(router);

setupRouterGuard()
app.mount('#app')
