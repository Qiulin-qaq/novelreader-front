<template>
 
  <el-pagination
    size="small"
    background
    layout="prev, pager, next"
    :total="totalItems"
    :page-size="pageSize"
    :current-page="currentPage"
    @current-change="handlePageChange"
   
  />

</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';

// 定义 emit，用于向父组件传递事件
const emit = defineEmits(['update:page']);

// 响应式数据
const totalItems = ref(10);  // 假设总共有100条记录
const pageSize = ref(4);     // 每页显示10条记录
const currentPage = ref(1);   // 当前页码

// 页码切换时的处理函数
const handlePageChange = (newPage: number) => {
  currentPage.value = newPage;
  emit('update:page', newPage);  // 通过 emit 传递页码给父组件
};
</script>


