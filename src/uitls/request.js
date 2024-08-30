import axios from 'axios'
import { useTokenStore } from '@/stores/token';

const baseurl = '/api';
const instance = axios.create({ baseurl })

// 请求拦截器

instance.interceptors.request.use(
    (config) => {
        const tokenStore = useTokenStore()
        if(tokenStore.token){
            config.headers.Authorization = tokenStore.token
        }

        return config
    },
    (err) => {
        Promise.reject(err)
    }

    
)


// 响应拦截器

instance.interceptors.response.use(
    response => {
        return response.data

    },
    err => {
        alert("error")
        // 异步状态转换为失败状态
        return Promise.reject(err)
    }
)

export default instance

