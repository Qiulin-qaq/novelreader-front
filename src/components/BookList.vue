<template>
  
    <div class="container">
      <el-card 
        v-for="(card, index) in cards" 
        :key="index" 
        :style="{ 
          maxWidth: '240px', 
          margin: '20px', 
          backgroundColor: themeColor.cardBgColor, 
          color: themeColor.cardTextColor 
        }"
      >
        <template #header>Yummy hamburger</template>
        <img
          src="/src/assets/png/logo.png"
          style="width: 100%"
        />  
      </el-card>
    </div>
 
</template>

<script setup>
import { ref } from 'vue';
import { useThemeStore } from '@/stores/themeStore';

const cards = Array.from({ length: 4 }); // 模拟4个卡片
const themeStore = useThemeStore();
const themeColor = themeStore.themeColor; // 从 store 中获取主题颜色
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  padding: 20px; /* 添加内边距以防止内容贴边 */
}
</style>
