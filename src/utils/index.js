import axios from "axios";
//配置路径
axios.default.baseURL = "http://localhost:8080/books/";
//请求拦截
axios.interceptors.request.use((config) => config);

//响应拦截
axios.interceptors.response.use(
  (response) => {
    // 成功响应处理逻辑
    if (response.data.code === 200) {
      return response.data; // 返回实际数据
    } else {
      // 错误响应处理逻辑
      ElMessage.error(response.data.msg || "操作失败");
      return Promise.reject(response.data); // 返回错误
    }
  },
  (error) => {
    // 处理网络错误等
    ElMessage.error("网络错误或服务异常，请稍后重试");
    return Promise.reject(error);
  }
);
export default axios;
