<template>
    <div class="welcome-animation" v-if="showAnimation">
      <h1>Welcome to AI-Novel Reader</h1>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  
  const showAnimation = ref(true);
  
  onMounted(() => {
    // 动画持续 3 秒
    setTimeout(() => {
      showAnimation.value = false;
    }, 3000);
  });
  </script>
  
  <style scoped>
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
  </style>
  