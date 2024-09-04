<template>
  <div id="NavBar">
    <NavBar />
    <router-view />
  </div>

  <div class="container">
    <el-card class="fixed-card">
      <div class="classic-book-section">搜索结果</div>

      <!-- 显示搜索结果列表 -->
      <div v-if="books.length > 0" id="BookList" class="book-list">
        <el-card 
          v-for="(book, index) in books" 
          :key="index" 
          class="book-card" 
          @click="navigateToDetail(book.id)" 
          style="cursor: pointer;">
          <template #header>{{ book.title }}</template>
          <img src="/src/assets/png/logo.png" alt="Book Cover" class="book-cover" />
        </el-card>
      </div>
      <div v-else class="book-list">
        <!-- 空白卡片 -->
        <el-card class="book-card">
          <template #header>暂无内容</template>
          <img src="/src/assets/png/logo.png" alt="Placeholder" class="book-cover" />
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { useTokenStore } from '@/stores/token'; // 导入 useTokenStore

// 保存搜索结果
const books = ref([]);  
const router = useRouter(); // 初始化 router
const route = useRoute(); // 获取当前路由

// 获取 token
const tokenStore = useTokenStore();
const token = tokenStore.token;

// 获取搜索结果数据
const fetchSearchResults = async (query: string) => {
  try {
    // 发送 GET 请求，查询参数通过 URL 传递
    const response = await axios.get('/api/search', {
      params: { query },  // 将查询参数添加到 GET 请求中
      headers: {
        'Authorization': `Bearer ${token}`  // 添加 Authorization 头
      }
    });
    const resultlist = response.data.data;

    if (resultlist.length > 0) {
      books.value = resultlist;
    } else {
      books.value = [{ title: '暂无内容', picture: '/src/assets/png/logo.png' }];
    }
  } catch (error) {
    console.error("Failed to fetch search results:", error);
    books.value = [{ title: '暂无内容', picture: '/src/assets/png/logo.png' }];
  }
};

// 在组件挂载时执行搜索请求
onMounted(() => {
  // 如果没有token，重定向到登录页面
  if (!token) {
    console.warn("No token found, redirecting to login page.");
    router.push('/User/login'); // 假设你的登录页面路径是 /login
    return;
  }

  const query = route.query.query as string;
  if (query) {
    fetchSearchResults(query);
  }
});

// 页面导航函数
const navigateToDetail = (fileId: number) => {
  router.push(`/books/${fileId}`);
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.fixed-card {
  width: 80%;
  min-height: 80vh;
  padding: 20px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
}

.classic-book-section {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  padding: 10px 40px;
  margin: 20px 0;
  font-family: 'Georgia', serif;
}

.book-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.book-card {
  width: 100%;
  height: 360px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.book-cover {
  width: 100%;
  height: auto;
  flex-grow: 1;
}

.no-content {
  font-size: 18px;
  color: #999;
  text-align: center;
  padding: 50px 0;
}
</style>
