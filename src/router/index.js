import { createRouter, createWebHistory } from 'vue-router'
import BookDetailVue from '@/views/BookDetail.vue'
const routes = [
    // {
    //     path: '/login', components: LoginVue
    // },
    {
        path: '/a',
        component: BookDetailVue,
    },
    

]


const router = createRouter({
    routes: routes,
    history: createWebHistory()
})

export default router