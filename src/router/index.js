import { createRouter, createWebHistory } from 'vue-router';

// 导入页面组件
import Home from '@/views/Home.vue';
import Bookshelf from '@/views/BookShelf.vue';


// 定义路由
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/bookshelf',
    name: 'Bookshelf',
    component: Bookshelf,
  },
  
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(), // 使用HTML5模式的路由
  routes,
});

export default router;
