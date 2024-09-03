import { createRouter, createWebHistory } from 'vue-router';

// 导入页面组件
import Home from '@/views/Home.vue';
import searchPage from '@/views/searchPage.vue';
import BookDetail from '@/views/BookDetail.vue';
import Books from '@/views/Books.vue'

import LoginVue from '@/views/Login.vue'; // 假设组件文件名为 Login.vue
import SignUp from '@/views/Signup.vue';
import { useTokenStore } from '@/stores/token';
import BookRead from '@/views/BookRead.vue';

// 定义路由
const routes = [
  {
    path: '/Main',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/search',
    name: 'searchPage',
    component: searchPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/book/:id',
    component: BookDetail,
    // meta: { requiresAuth: true }

  },
  {
    path: '/books',
    component: Books,
    meta: { requiresAuth: true }
  },


  {
    path: "/User/login",
    component: LoginVue
  },
  {
    path: "/User/signup",
    component: SignUp,
  },

  {
    path: "/book/:id/read",
    component: BookRead,
  }
  
];

// 创建并导出路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

//全局守卫
router.beforeEach((to, from, next) => {
  const tokenStore = useTokenStore();

  // 检查目标路由是否需要授权访问
  if (to.meta.requiresAuth && !tokenStore.token) {
    ElMessage.error('请先登录');
    next('/User/login'); // 未登录时跳转到登录页面
  } else {
    next(); // 已登录或不需要授权，继续导航
  }
});

export default router;
