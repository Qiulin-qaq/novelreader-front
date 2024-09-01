<template>
  <Navbar></Navbar>

  <!-- 全选和部分选择 -->
  <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"
    style="margin-top: 30px; margin-left: 30px;">
    全选
  </el-checkbox>
  <el-checkbox-group v-model="checkedtypes" @change="handleCheckedtypesChange">
    <el-checkbox v-for="type in types" :key="type" :label="type" :value="type" style="margin-left: 30px;">
      {{ type }}
    </el-checkbox>
  </el-checkbox-group>

  <!-- 显示过滤后的书籍 -->
  <div class="books-container">
    <div class="book-item" v-for="book in filteredBooks" :key="book.id">
      <img :src="book.picture" alt="book image" class="book-image" />
      <div class="book-info">
        <h3>{{ book.title }}</h3>
        <p>作者: {{ book.author }}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import 'element-plus/dist/index.css';
import Navbar from '@/components/NavBar.vue';
import { ref, computed, onMounted, watch } from 'vue';
import { booksService } from '@/api/books';

const novels = ref([{
  "id": 1,
  "title": "Mystery of the Old House",
  "picture": "oldhouse.jpg",
  "author": "John Doe",
  "type": true
},
{
  "id": 2,
  "title": "Science Wonders",
  "picture": "science.jpg",
  "author": "Jane Smith",
  "type": true
},
{
  "id": 3,
  "title": "The Cooking Guide",
  "picture": "cooking.jpg",
  "author": "Chef Luigi",
  "type": false
},]); // 初始化为空数组
const checkedtypes = ref([]);
const checkAll = ref(false);
const types = ['本站推荐', '用户导入']; // 代表两种类型
const isIndeterminate = computed(() => checkedtypes.value.length > 0 && checkedtypes.value.length < types.length);

// 从后端获取书籍数据
const getBooks = async () => {
  try {
    const response = await booksService();
    novels.value = response.data.map(book => ({
      ...book,
      typeLabel: book.type ? '本站推荐' : '用户导入'  // 添加标签转换
    }));
    console.log("书籍数据加载成功:", novels.value);
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
    checkedtypes.value.includes(book.type ? '本站推荐' : '用户导入') // 使用标签过滤
  );
});

const handleCheckAllChange = (value) => {
  checkedtypes.value = value ? types.slice() : []; // 复制或清空
  console.log("全选状态改变:", checkedtypes.value); // 添加调试信息
};

const handleCheckedtypesChange = (value) => {
  checkAll.value = value.length === types.length;
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
</style>
