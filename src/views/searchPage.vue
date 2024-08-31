<template>
  <div id="NavBar">
    <NavBar />
    <router-view />
  </div>
  
  <div class="container">
    <el-card class="fixed-card">
      <div class="classic-book-section">搜索结果</div>

      <!-- 如果有书籍内容，显示书籍列表；否则显示提示消息或空白卡片 -->
      <div v-if="books.length > 0" id="BookList" class="book-list">
        <el-card v-for="(book, index) in books" :key="index" class="book-card">
          <template #header>{{ book.title }}</template>
          <img :src="book.picture" alt="Book Cover" class="book-cover" />
        </el-card>
      </div>
      <div v-else class="no-content">
        <el-card class="book-card">
          <template #header>暂无内容</template>
          <img src="/src/assets/png/logo.png" alt="Placeholder" class="book-cover" />
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

// 保存书籍列表数据
const books = ref([]);

// 获取搜索结果书籍数据
const fetchBooks = async () => {
  try {
    const response = await axios.get('/search');
    const fetchedBooks = response.data.data;

    // 更新书籍数据，如果数据为空则显示空白卡片
    if (fetchedBooks && fetchedBooks.length > 0) {
      books.value = fetchedBooks;
    } else {
      books.value = [{ title: '暂无内容', picture: '/src/assets/png/logo.png' }];
    }
  } catch (error) {
    console.error("Failed to fetch books:", error);
    // 如果发生错误，也显示空白卡片
    books.value = [{ title: '暂无内容', picture: '/src/assets/png/logo.png' }];
  }
};

// 初始化时加载搜索结果数据
fetchBooks();
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.fixed-card {
  width: 80%; /* 固定外层卡片的宽度 */
  padding: 20px;
  display: grid;
  grid-template-rows: auto 1fr; /* 设置网格行的布局 */
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
  grid-template-columns: repeat(4, 1fr); /* 每行显示4个卡片 */
  gap: 20px; /* 设置书籍卡片之间的间距 */
}

.book-card {
  width: 100%; /* 使卡片宽度自适应 */
  height: 360px; /* 固定书籍卡片的高度 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.book-cover {
  width: 100%;
  height: auto;
  flex-grow: 1; /* 图片部分自适应卡片高度 */
}

.no-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 360px; /* 保持与其他卡片相同的高度 */
  font-size: 18px;
  color: #999;
  text-align: center;
}
</style>
