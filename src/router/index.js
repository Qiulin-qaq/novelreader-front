import { createRouter, createWebHistory } from 'vue-router';

// 导入页面组件
import Home from '@/views/Home.vue';
import searchPage from '@/views/searchPage.vue';
import BookDetail from '@/views/BookDetail.vue';

// 定义路由
const routes = [
  {
    path: '/Main',
    name: 'Home',
    component: Home,
  },
  {
    path: '/search',
    name: 'searchPage',
    component: searchPage,
  },
  {
    path: '/book/:id',
    component: BookDetail
  },
  
];

// 创建并导出路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
