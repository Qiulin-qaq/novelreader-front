import { useTokenStore } from "@/stores/token";
import axios from "axios";
import { ElMessage } from "element-plus";



const baseURL = "/api";
const instance = axios.create({ baseURL });
import router from '@/router'

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 成功响应处理逻辑
    if (response.data.code === 200) {
      return response.data;  // 返回实际数据
    } else {
      // 错误响应处理逻辑
      ElMessage.error(response.data.msg || "操作失败");
      return Promise.reject(response.data);  // 返回错误
    }
  },
  (error) => {

    // 处理网络错误等
    ElMessage.error("网络错误或服务异常，请稍后重试");
    return Promise.reject(error);
  }
);



// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const tokenStore = useTokenStore()

    if (tokenStore.token) {
      config.headers.Authorization = 'Bearer ' + tokenStore.token
    }
    return config

  },
  (err) => {
    Promise.reject(err)
  }
)

export default instance;