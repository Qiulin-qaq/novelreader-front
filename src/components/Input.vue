<template>
    <div class="flex gap-4 mb-4">
      <el-input
        v-model="input2"
        class="custom-input"
        placeholder="Type something"
        :prefix-icon="Search"
      />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Calendar, Search } from '@element-plus/icons-vue'

const input2 = ref('')
</script>

<style scoped>
.custom-input {
    width: 400px;
    border-radius: 20px; /* 设置圆角幅度 */
}
</style>
