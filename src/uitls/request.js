import axios from 'axios'

const baseurl = '/api';
const instance = axios.create({ baseurl })

// 响应拦截器

instance.interceptors.response.use(
    result => {
        return result.data

    },
    err => {
        alert("error")
        // 异步状态转换为失败状态
        return Promise.reject(err)
    }
)

export default instance

