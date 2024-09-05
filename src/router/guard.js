import {useTokenStore} from '@/stores/token'

import router from '@/router'

export function setupRouterGuard() {
    router.beforeEach((to, from ,next)=>{
        const tokenStore = useTokenStore()

        if(!tokenStore.getToken()){
            if(to.meta.requiresAuth) {
                next('/User/login')
            }
            else {
                next()
            }
        }
        else{
            next()
        }
    })
}