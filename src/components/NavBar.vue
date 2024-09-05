<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false" @select="handleSelect"
    :style="{ fontSize: fontSize, backgroundColor: themeColor.navBgColor }">
    <div class="left-menu">
      <el-menu-item index="0">
        <img style="width: 50px;" src="/src/assets/png/logo.png" alt="logo" />
      </el-menu-item>
      <el-menu-item index="1" @click="navigateTo('/Main', '1')">主页</el-menu-item>
      <el-menu-item index="2" @click="navigateTo('/bookshelf', '2')">书架</el-menu-item>
      <el-menu-item index="3" @click="navigateTo('/books', '3')">书库</el-menu-item>
    </div>

    <div class="right-menu">
      <div>
        <el-input v-model="searchQuery" placeholder="搜索..." @keyup.enter="handleSearch" clearable
          @clear="handleSearchClear" />
      </div>
      <el-sub-menu index="4">
        <template #title>设置</template>
        <el-sub-menu index="4-1">
          <template #title>字体调节</template>
          <el-menu-item index="4-1-1" @click="setFontSize('20px')">大号字体</el-menu-item>
          <el-menu-item index="4-1-2" @click="setFontSize('16px')">中号字体</el-menu-item>
          <el-menu-item index="4-1-3" @click="setFontSize('12px')">小号字体</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
    </div>
  </el-menu>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFontSizeStore } from '@/stores/fontSizeStore';
import { useThemeStore } from '@/stores/themeStore';

const activeIndex = ref('1');
const router = useRouter();
const route = useRoute();
const fontSizeStore = useFontSizeStore();
const themeStore = useThemeStore();

const fontSize = fontSizeStore.fontSize;
const themeColor = themeStore.themeColor;
const searchQuery = ref(''); // 搜索关键词的绑定

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

// 根据当前路径动态设置 activeIndex
const setActiveIndexByRoute = () => {
  const path = route.path;
  if (path === '/Main') {
    activeIndex.value = '1';
  } else if (path === '/bookshelf') {
    activeIndex.value = '2';
  } else if (path === '/books') {
    activeIndex.value = '3';
  }
};

const navigateTo = (path: string, index: string) => {
  activeIndex.value = index
  router.push(path);
};

const setFontSize = (size: string) => {
  fontSizeStore.setFontSize(size);
};

const setTheme = (theme: string) => {
  themeStore.setTheme(theme);
};

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value) {
    router.push({ path: '/search', query: { query: searchQuery.value } });
  }
};

// 处理搜索清空
const handleSearchClear = () => {
  searchQuery.value = '';
  router.push({ path: '/search' });
};

onMounted(()=>{
  setActiveIndexByRoute();
})

watch(route, () => {
  setActiveIndexByRoute();
});
</script>

<style scope>
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
  /* 将设置菜单项推到右侧 */
}
</style>
