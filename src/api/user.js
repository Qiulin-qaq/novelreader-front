// 导入request.js请求工具
import request from "@/utils/request.js";

// 提供调用注册接口的函数
export const userRegisterService = (registerData) => {
  const formData = new FormData();
  formData.append('username', registerData.username);
  formData.append('password', registerData.password);
  formData.append('re_password', registerData.repassword);

  return request.post("http://localhost:8080/User/signup", formData);  // 使用完整的后端路径
};

// 提供调用登录接口的函数
export const userLoginService = (loginData) => {
  const formData = new FormData();
  for (let key in loginData) {
    if (loginData[key] !== null && loginData[key] !== undefined) {
      formData.append(key, loginData[key]);
    }
  }
  return request.post("/User/login", formData);  // 使用封装好的 request 工具
};
