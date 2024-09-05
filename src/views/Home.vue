<template>
  <div>
    
    <div v-if="showAnimation" class="welcome-animation">
      <h1>Welcome to AI-Novel Reader</h1>
    </div>

    
    <div v-if="!showAnimation" class="main-content">
      <div id="NavBar">
        <NavBar />
      </div>

      <div class="background-blur">
        <div>
          <Bot />
        </div>

        <div class="carousel-container">
          <el-card class="background">
            <el-carousel :autoplay="true" arrow="always" type="card" height="400px">
              <el-carousel-item v-for="(book, index) in books" :key="index">
                <el-card class="book-card" @click="navigateToDetail(book.id)">
                  <template #header>{{ book.title }}</template>
                  <img :src="book.picture || '/src/assets/png/logo.png'" alt="Book Cover" class="book-cover" />
                </el-card>
              </el-carousel-item>
            </el-carousel>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
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

// 获取 token
const tokenStore = useTokenStore();
const token = tokenStore.token;

const router = useRouter(); // 初始化 router

// 获取书籍数据，固定分页为1
const fetchBooks = async () => {
  // 如果没有token，重定向到登录页面
  if (!token) {
    console.warn("No token found, redirecting to login page.");
    router.push('/User/login');
    return;
  }

  try {
    // 请求第一页的书籍数据
    const response = await axios.get('/api/Main', {
      params: { page: 1, pageSize: 4 }, // 固定请求第一页的内容
      headers: {
        Authorization: `Bearer ${token}`, // 添加 Authorization 头
      },
    });
    const fetchedBooks = response.data.data;

    if (fetchedBooks && fetchedBooks.length > 0) {
      books.value = fetchedBooks; // 更新书籍列表
    } else {
      console.log('No books found, displaying placeholder');
      books.value = [{ title: '暂无内容', picture: '/src/assets/png/logo.png' }];
    }
  } catch (error) {
    console.error('Failed to fetch books:', error.message);
    books.value = [{ title: '暂无内容', picture: '/src/assets/png/logo.png' }];
  }
};

// 页面导航函数
const navigateToDetail = (id: number) => {
  router.push(`/books/${id}`);
};

// 初始加载时调用 fetchBooks
onMounted(() => {
  fetchBooks();
});
</script>

<style scoped>
/* 动画部分样式 */
.welcome-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #007bff, #00ff7f);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  z-index: 9999;

}

.welcome-animation h1 {
  font-size: 3rem;
  color: #fff;
  animation: fadeInOut 3s ease-in-out, scaleUp 3s ease-in-out;
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

/* 背景颜色渐变的动画 */
@keyframes backgroundFade {
  0% {
    background: linear-gradient(135deg, #007bff, #00ff7f);
  }

  50% {
    background: linear-gradient(135deg, #ff5722, #3f51b5);
  }

  100% {
    background: linear-gradient(135deg, #673ab7, #00bcd4);
  }
}

/* 文字缩放动画 */
@keyframes scaleUp {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

/* 背景颜色渐变的动画 */
@keyframes backgroundFade {
  0% {
    background: linear-gradient(135deg, #007bff, #00ff7f);
  }

  50% {
    background: linear-gradient(135deg, #ff5722, #3f51b5);
  }

  100% {
    background: linear-gradient(135deg, #673ab7, #00bcd4);
  }
}

/* 文字缩放动画 */
@keyframes scaleUp {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

/* 主内容部分样式 */
.main-content {
  position: relative;
  z-index: 1;
  
}

/* 背景图片容器 */
.background-blur {
  position: relative;
}

/* 卡片背景样式 */
.background {
  background-image: url('https://revo.zongheng.com/www/2024/images/75caf4c.png');
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  padding: 20px;
  margin-top: 70px;
  width: 100;
}

/* 背景模糊效果 */
.background-blur::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('https://revo.zongheng.com/www/2024/images/75caf4c.png');
  background-size: cover;
  background-position: center;
  filter: blur(10px);
  z-index: -1;
}

/* 轮播容器样式 */
.carousel-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
  border-radius: 16px;
}

/* 书籍卡片样式 */
.book-card {
  width: 300px;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

/* 卡片悬停效果 */
.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* 书籍封面样式 */
.book-cover {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

/* 轮播项居中对齐 */
.el-carousel__item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-card img {
  border-bottom: 1px solid #ddd;
  object-fit: contain;
  width: 100%;
  height: auto;
  max-height: 300px;
}
</style>
