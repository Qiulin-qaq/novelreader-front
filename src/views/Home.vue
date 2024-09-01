<template>
  <NavBar></NavBar>



  <div class="container">
    <el-card class="fixed-card">
      <div class="classic-book-section">经典书目</div>

      <!-- 如果有书籍内容，显示书籍列表；否则显示提示消息或空白卡片 -->
      <div v-if="books.length > 0" id="BookList" class="book-list">
        <el-card v-for="(book, index) in books" :key="index" class="book-card" @click="navigateToDetail(book.id)"
          style="cursor: pointer;">
          <template #header>{{ book.title }}</template>
          <img :src="book.picture" alt="Book Cover" class="book-cover" />
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Pagination from '@/components/Pagination.vue';

// 保存书籍列表数据
const books = ref([]);
// 当前页码
const currentPage = ref(1);
// 总书籍数
const totalBooks = ref(0);
// 每页显示的书籍数量
const pageSize = ref(4);

const router = useRouter(); // 初始化 router

// 获取书籍数据，传递分页参数
const fetchBooks = async (page: number) => {
  try {
    const response = await axios.get('/api/Main', {
      params: { page: page, pageSize: pageSize.value }  // 传递分页参数
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
  router.push(`/detail/${fileId}`);
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

.pagination-bottom {
  display: flex;
  justify-content: center;
  align-self: end;
}
</style>
