<script setup lang="ts">
import Pagination from '@/components/Pagination.vue';
</script>

<template>
  <div id="NavBar">
    <NavBar />
    <router-view />
  </div>
  
  <div class="container">
    <el-card style=" padding: 20px;">
      <div class="classic-book-section">
        搜索结果
    </div>
    
 <div id="BookList">
  <BookList/>
  <router-view/>
 </div>
 <div id="Pagination">
  <Pagination/>
  <rounter-view/>
 </div>
</el-card>
</div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  padding: 20px; /* 添加内边距以防止内容贴边 */
}
.classic-book-section {
  font-size: 24px; /* 设置字体大小 */
  font-weight: bold; /* 设置字体加粗 */
  color: #333; /* 设置文字颜色 */
  
  padding: 10px 40px; /* 设置内边距 */
  
  margin: 20px 0; /* 设置外边距 */
  font-family: 'Georgia', serif; /* 使用经典的字体 */
}

</style>
