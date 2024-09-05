<template>
  <div>
    <!-- 动画部分 -->
    <div v-if="showAnimation" class="welcome-animation">
      <h1>Welcome to AI-Novel Reader</h1>
    </div>

    <!-- 当动画结束时，显示主内容 -->
    <div v-if="!showAnimation">
      <div id="NavBar">
        <NavBar />
        <router-view />
      </div>

      <div id="Bot">
        <Bot />
      </div>
      <div class="block text-center">

        <el-carousel height="150px">
          <el-carousel-item v-for="item in 4" :key="item">
            <h3 class="small justify-center" text="2xl">{{ item }}</h3>
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="container">
        <el-card class="fixed-card">
          <div class="classic-book-section">
            <p class="font">经典书目</p>
          </div>

          <!-- 如果有书籍内容，显示书籍列表；否则显示提示消息或空白卡片 -->
          <div v-if="books.length > 0" id="BookList" class="book-list">
            <el-card v-for="(book, index) in books" :key="index" class="book-card" @click="navigateToDetail(book.id)"
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

          <!-- 分页组件 -->
          <div id="Pagination" class="pagination-bottom">
            <Pagination @update:page="handlePageUpdate" />
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Pagination from '@/components/Pagination.vue';
import { useTokenStore } from '@/stores/token'; // 导入 useTokenStore

// 动画显示与隐藏
const showAnimation = ref(true);

// 在页面加载时播放动画
onMounted(() => {
  setTimeout(() => {
    showAnimation.value = false; // 3秒后隐藏动画，显示主页面
  }, 3000);
});

// 保存书籍列表数据
const books = ref([]);
// 当前页码
const currentPage = ref(1);
// 总书籍数
const totalBooks = ref(0);
// 每页显示的书籍数量
const pageSize = ref(4);

const router = useRouter(); // 初始化 router

// 获取 token
const tokenStore = useTokenStore();
const token = tokenStore.token;

// 获取书籍数据，传递分页参数
const fetchBooks = async (page: number) => {
  // 如果没有token，重定向到登录页面
  if (!token) {
    console.warn("No token found, redirecting to login page.");
    router.push('/User/login');
    return;
  }

  try {
    const response = await axios.get('/api/Main', {
      params: { page: page, pageSize: pageSize.value },  // 传递分页参数
      headers: {
        'Authorization': `Bearer ${token}`  // 添加 Authorization 头
      }
    });
    const fetchedBooks = response.data.data;
    totalBooks.value = response.data.total || 0; // 设置总书籍数量

    if (fetchedBooks && fetchedBooks.length > 0) {
      books.value = fetchedBooks;
    } else {
      console.log("No books found, displaying placeholder");
      books.value = [{ title: '暂无内容', picture: '/src/assets/png/logo.png' }];
    }
  } catch (error) {
    console.error("Failed to fetch books:", error.message);
    books.value = [{ title: '暂无内容', picture: '/src/assets/png/logo.png' }];
  }
};

// 处理页码更新
const handlePageUpdate = (newPage: number) => {
  currentPage.value = newPage;
  fetchBooks(newPage); // 根据新的页码获取数据
};

// 初始化时加载第一页的数据
fetchBooks(currentPage.value);

// 页面导航函数
const navigateToDetail = (fileId: number) => {
  router.push(`/books/${fileId}`);
};
</script>

<style scoped>
/* 动画部分 */
.welcome-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.welcome-animation h1 {
  font-size: 3rem;
  color: #007bff;
  animation: fadeInOut 3s ease-in-out;
}

/* 渐入渐出的动画效果 */
@keyframes fadeInOut {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-top: 100px;
  height: 600px;
  /* Adjust the container height as needed */
  padding: 20px;
  /* Compensate for the fixed navbar height */
}

.fixed-card {
  width: 80%;
  height: 100%;
  /* Make the card take the full height of the container */
  max-width: 1200px;
  /* Optional: set a max width */
  display: grid;
  grid-template-rows: 60px 1fr auto;
  margin-top: 0;
  overflow: hidden;
  /* Prevent content overflow */
  position: relative;
  /* Ensure that the pagination can be absolutely positioned relative to the card */
}

.classic-book-section {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  padding: 10px 40px;
  margin: 10px 0;
  font-family: 'Georgia', serif;
}

.book-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.book-card {
  width: 100%;
  height: 350px;
  /* Adjust card height */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.book-cover {
  width: 100%;
  height: auto;
  flex-grow: 1;
}

.book-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.pagination-bottom {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  display: flex;
  justify-content: center;
  padding: 50px 0;
  align-items: center;
}

.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>