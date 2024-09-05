<script setup>
import { User, Lock } from "@element-plus/icons-vue";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { useTokenStore } from "@/stores/token.js";
import { useRouter } from "vue-router";
import { userLoginService } from "@/api/user";


const registerData = ref({
  username: "",
  password: "",
});

// 校验再次输入的密码的函数
const checkRePassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次确认密码"));
  } else if (value !== registerData.value.password) {
    callback(new Error("请确保两次输入的密码一致"));
  } else {
    callback();
  }
};

// 定义表单校验规则
const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 1, max: 16, message: "用户名必须为5-16位非空字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 1, max: 16, message: "密码必须为5-16位非空字符", trigger: "blur" },
  ],
  re_password: [{ validator: checkRePassword, trigger: "blur" }],
};

// 绑定数据，复用注册表单的注册模型
// 登录函数
const router = useRouter();
const tokenStore = useTokenStore();

const login = async () => {
  try {
    let result = await userLoginService(registerData.value);

    if (result.code === 200) {
      // 成功登录
      ElMessage.success(result.msg);
      // // 把得到的token存储到pinia中
      tokenStore.setToken(result.data);
      // // 跳转到首页  借助路由完成
      router.push("/Main");
      // 清空表单数据
      clearRegisterData();
    } else {
      // 登录失败，显示后端返回的消息
      ElMessage.error(result.msg);
    }
  } catch (err) {
    // 捕获网络或其他错误
    console.error("Login error:", err);
    ElMessage.error("登录过程中发生错误，请稍后重试");
  }
};

// 定义清空函数以防止登录表单和注册表单数据绑定
const clearRegisterData = () => {
  registerData.value = {
    username: "",
    password: "",
    re_password: "",
  };
};
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 登录表单 -->
      <el-form ref="form" size="large" autocomplete="off" :model="registerData" :rules="rules">
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
            v-model="registerData.password"></el-input>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="
            router.push('/User/signup');
          clearRegisterData();
          ">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
  height: 888px;
  background-color: #fff;
  overflow: hidden;
  .bg {
    background: url("@/assets/login_bg.jpg") no-repeat center / cover;
    border-radius: 0 20px 20px 0;
    height: 100%;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    
      .button {
        width: 100px; // 确保按钮在表单容器内占满可用宽度
        margin-left: 0px;
      }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
