<template>
  <Navbar></Navbar>
  <div>
    <!-- 全选和部分选择 -->
    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"
      style="margin-top: 30px; margin-left: 300px;">
      全选
    </el-checkbox>
    <el-checkbox-group v-model="checkedtypes" @change="handleCheckedtypesChange">
      <el-checkbox v-for="type in types" :key="type" :label="type" :value="type" style="margin-left: 300px;">
        {{ type }}
      </el-checkbox>
    </el-checkbox-group>
  </div>

  <el-divider />
  <!-- 显示过滤后的书籍 -->
  <div class="books-container ">
    <el-card style="max-width: 480px;" v-for="book in filteredBooks" :key="book.id">
      <template #header>{{ book.title }}</template>
      <img :src="book.picture" style="width: 100%" alt="Cover Image" />
    </el-card>
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
  "picture": "img/background.jpg",
  "author": "John Doe",
  "type": true
},
{
  "id": 2,
  "title": "Science Wonders",
  "picture": "img/background.jpg",
  "author": "Jane Smith",
  "type": true
},
{
  "id": 3,
  "title": "The Cooking Guide",
  "picture": "img/background.jpg",
  "author": "Chef Luigi",
  "type": false
},
{
  "id": 3,
  "title": "The Cooking Guide",
  "picture": "img/background.jpg",
  "author": "Chef Luigi",
  "type": false
},
{
  "id": 3,
  "title": "The Cooking Guide",
  "picture": "img/background.jpg",
  "author": "Chef Luigi",
  "type": false
},
{
  "id": 3,
  "title": "The Cooking Guide",
  "picture": "img/background.jpg",
  "author": "Chef Luigi",
  "type": false
},
{
  "id": 3,
  "title": "The Cooking Guide",
  "picture": "img/background.jpg",
  "author": "Chef Luigi",
  "type": false
}, {
  "id": 3,
  "title": "The Cooking Guide",
  "picture": "img/background.jpg",
  "author": "Chef Luigi",
  "type": false
}, {
  "id": 3,
  "title": "The Cooking Guide",
  "picture": "img/background.jpg",
  "author": "Chef Luigi",
  "type": false
}, {
  "id": 3,
  "title": "The Cooking Guide",
  "picture": "img/background.jpg",
  "author": "Chef Luigi",
  "type": false
}, {
  "id": 3,
  "title": "The Cooking Guide",
  "picture": "img/background.jpg",
  "author": "Chef Luigi",
  "type": false
}, {
  "id": 3,
  "title": "The Cooking Guide",
  "picture": "img/background.jpg",
  "author": "Chef Luigi",
  "type": false
}, {
  "id": 3,
  "title": "The Cooking Guide",
  "picture": "img/background.jpg",
  "author": "Chef Luigi",
  "type": false
}, {
  "id": 3,
  "title": "The Cooking Guide",
  "picture": "img/background.jpg",
  "author": "Chef Luigi",
  "type": false
},
]); // 初始化为空数组
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
  justify-content: space-between;
  /* 在容器内水平分布 */
  gap: 50px;
  row-gap: 150px;
  margin-left: 100px;
  margin-top: 150px;
  padding-bottom: 50px;
  /* 底部添加额外空间 */
  background-color: #f8f9fa;
  /* 背景色为淡灰色 */
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
}

.el-card:hover {
  transform: translateY(-10px);
  /* 悬停时轻微抬升 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  /* 悬停时增加阴影 */
}

.el-card img {
  border-bottom: 1px solid #ddd;
  /* 图片与内容之间添加分隔线 */
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
</style>