<template>
  <div class="background-blur">
    <Navbar></Navbar>
    <div class="checkbox-container">
      <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
        全选
      </el-checkbox>
      <el-checkbox-group v-model="checkedtypes" @change="handleCheckedtypesChange">
        <el-checkbox v-for="status in statuses" :key="status" :label="status" :value="status">
          {{ status }}
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <el-divider />
    <!-- 显示过滤后的书籍 -->
    <div class="books-container ">
      <el-card style="max-width: 480px;" v-for="book in filteredBooks" :key="book.id"
        @click="$router.push(`/books/${book.id}`)">
        <template #header>{{ book.title }}</template>
        <img :src="book.picture" style="width: 100%" alt="Cover Image" />
      </el-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import 'element-plus/dist/index.css';
import Navbar from '@/components/NavBar.vue';
import { ref, computed, onMounted, watch } from 'vue';
import { booksService } from '@/api/books';
import { useBookStore } from '@/stores/book'

const novels = ref([

]); // 初始化为空数组
const checkedtypes = ref([]);
const checkAll = ref(false);
const statuses = ['本站推荐', '用户导入']; // 代表两种类型
const isIndeterminate = computed(() => checkedtypes.value.length > 0 && checkedtypes.value.length < statuses.length);
const bookStore = useBookStore()

// 从后端获取书籍数据
const getBooks = async () => {
  try {
    const response = await booksService();
    novels.value = response.data.map(book => ({
      ...book,
      typeLabel: book.status ? '本站推荐' : '用户导入'  // 添加标签转换
    }));
    console.log("书籍数据加载成功:", novels.value);

    novels.value.forEach(novel => {
      bookStore.addBookId(novel.id)
    })



  } catch (error) {
    console.error("加载书籍数据失败:", error);
  }
};

onMounted(() => {
  getBooks(); // 调用 getBooks 而不是直接操作 novels
});

const filteredBooks = computed(() => {
  if (checkedtypes.value.length === 0) return novels.value;
  return novels.value.filter(book =>
    checkedtypes.value.includes(book.status ? '本站推荐' : '用户导入') // 使用标签过滤
  );
});

const handleCheckAllChange = (value) => {
  checkedtypes.value = value ? statuses.slice() : []; // 复制或清空
  console.log("全选状态改变:", checkedtypes.value); // 添加调试信息
};

const handleCheckedtypesChange = (value) => {
  checkAll.value = value.length === statuses.length;
  console.log("多选框改变:", checkedtypes.value); // 添加调试信息
};

// 调试信息输出
watch(filteredBooks, (newVal, oldVal) => {
  console.log("过滤后的书籍:", newVal);
}, { deep: true });

</script>




<style scoped>
.books-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  /* 左对齐卡片 */
  gap: 50px;
  row-gap: 150px;
  margin-left: 100px;
  margin-top: 150px;
  padding-bottom: 50px;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
}






.book-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 10px;
  padding: 10px;
  width: 200px;
}

.book-image {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.book-info {
  margin-top: 10px;
}

.el-card {
  height: 300px;
  width: 300px;
  margin-top: -100px;
  border-radius: 10px;
  /* 圆角效果 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* 添加阴影效果 */
  overflow: hidden;
  /* 确保内容不会溢出 */
  transition: transform 0.2s, box-shadow 0.2s;
  /* 添加动画效果 */

  cursor: pointer;

}

.el-card:hover {
  transform: translateY(-10px);
  /* 悬停时轻微抬升 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  /* 悬停时增加阴影 */
}

.el-card img {
  border-bottom: 1px solid #ddd;
  object-fit: contain;
  width: 100%;
  height: auto;
  max-height: 200px;
}

.el-card header {
  font-weight: bold;
  font-size: 1.2em;
  padding: 10px;
  background-color: #f5f5f5;
  /* 添加背景色 */
}

.el-card .book-info {
  padding: 15px;
}


.checkbox-container {
  margin-top: 30px;
  margin-left: 300px;
  background-color: #fff;
  /* 背景颜色 */
  padding: 10px 20px;
  /* 内边距 */
  border-radius: 8px;
  /* 圆角 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* 阴影效果 */
  width: 50%;
}

.checkbox-container .el-checkbox {
  margin-right: 20px;
  /* 复选框之间的间距 */
  font-size: 16px;
  /* 调整字体大小 */
  color: #333;
  /* 字体颜色 */
}

.checkbox-container .el-checkbox:hover {
  color: #007bff;
  /* 悬停时改变字体颜色 */
}

.checkbox-container .el-checkbox-group {
  display: flex;
  align-items: center;
  gap: 20px;
  /* 控制复选框之间的间距 */
}

.checkbox-container .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #007bff;
  /* 选中时的背景颜色 */
  border-color: #007bff;
  /* 选中时的边框颜色 */
}

.checkbox-container .el-checkbox__input.is-checked .el-checkbox__inner::after {
  border-color: #fff;
  /* 选中时的勾颜色 */
}

.background-blur {
  position: relative;
}
.background-blur::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('https://revo.zongheng.com/www/2024/images/75caf4c.png'); /* 背景图片 */
  background-size: cover;
  background-position: center;
  filter: blur(10px); /* 仅模糊背景图片 */
  z-index: -1; /* 确保背景在所有内容的后面 */
}
</style>