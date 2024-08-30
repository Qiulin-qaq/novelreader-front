<template>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
    >
      <div class="left-menu">
        <el-menu-item index="0">
          <img style="width: 50px;" src="/src/assets/png/logo.png" alt="logo" />
        </el-menu-item>
        <el-menu-item index="1" @click="navigateTo('/')">主页</el-menu-item>
        <el-menu-item index="2" @click="navigateTo('/bookshelf')">书架</el-menu-item>
        <el-menu-item index="3" @click="navigateTo('/library')">书库</el-menu-item>
      </div>
      <div class="right-menu">
        <el-sub-menu index="4">
          <template #title>设置</template>
          <el-sub-menu index="4-1">
            <template #title>字体调节</template>
            <el-menu-item @click="changeFontSize('large')">大号字体</el-menu-item>
            <el-menu-item @click="changeFontSize('medium')">中号字体</el-menu-item>
            <el-menu-item @click="changeFontSize('small')">小号字体</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="4-2">
            <template #title>明暗调节</template>
            <el-menu-item index="4-2-1">亮色</el-menu-item>
            <el-menu-item index="4-2-2">暗色</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
      </div>
    </el-menu>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const activeIndex = ref('1')
  const router = useRouter()
  
  const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }
  
  const navigateTo = (path: string) => {
    router.push(path)
  }
  
  const changeFontSize = (size: string) => {
    document.documentElement.style.setProperty('--font-size', size)
  }
  </script>
  
  <style>
  .el-menu-demo {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .left-menu {
    display: flex;
    align-items: center;
  }
  
  .right-menu {
    display: flex;
    align-items: center;
    margin-left: auto;
  }
  </style>
  