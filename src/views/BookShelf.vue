<template>
  <Navbar></Navbar>
  <div class="container">
    <el-button class="uploading-button" @click="dialog = true"
      >上传小说</el-button
    >
  </div>
  <!-- draggable 允许拖拽 -->
  <el-dialog
    v-model="dialog"
    width="500"
    title="上传小说"
    draggable
    @close="dialogClose"
  >
    <el-form label-width="80">
      <el-upload
        v-model:file-list="fileList"
        class="upload-demo"
        action=""
        :http-request="uploadFile"
        :limit="1"
        :on-exceed="uploadExceed"
        :before-upload="beforeUpload"
        accept=".txt"
        :on-remove="uploadRemove"
      >
        <el-button type="primary">点击选择文件</el-button>
        <template #tip>
          <div class="el-upload__tip">请上传.txt文件,大小不超过30M</div>
        </template>
      </el-upload>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">上传</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <div class="checkbox-container">
    <el-checkbox
      v-model="checkAll"
      :indeterminate="isIndeterminate"
      @change="handleCheckAllChange"
    >
      全选
    </el-checkbox>
    <el-checkbox-group
      v-model="checkedtypes"
      @change="handleCheckedtypesChange"
    >
      <el-checkbox
        v-for="type in types"
        :key="type"
        :label="type"
        :value="type"
      >
        {{ type }}
      </el-checkbox>
    </el-checkbox-group>
  </div>

  <el-divider />
  <!-- 显示过滤后的书籍 -->
  <div class="books-container">
    <el-card
      style="max-width: 480px"
      v-for="book in filteredBooks"
      :key="book.id"
      @click="$router.push(`/books/starred_novels/${book.id}`)"
    >
      <template #header>{{ book.title }}</template>
      <img :src="book.picture" style="width: 100%" alt="Cover Image" />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import "element-plus/dist/index.css";
import Navbar from "@/components/NavBar.vue";
import { ref, computed, onMounted, watch, reactive } from "vue";
import { booksshelfService } from "@/api/booksshelf";
import { useBookshelfStore } from "@/stores/bookshelf";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import axios from '@/utils/request'
const novels = ref([]); // 初始化为空数组
const checkedtypes = ref([]);
const checkAll = ref(false);
const types = ["本站推荐", "用户导入"]; // 代表两种类型
const isIndeterminate = computed(
  () =>
    checkedtypes.value.length > 0 && checkedtypes.value.length < types.length
);
const bookStore = useBookshelfStore();

// 从后端获取书籍数据
const getBooks = async () => {
  try {
    const response = await booksshelfService();
    novels.value = response.data.map((book) => ({
      ...book,
      typeLabel: book.type ? "本站推荐" : "用户导入", // 添加标签转换
    }));
    console.log("书籍数据加载成功:", novels.value);

    novels.value.forEach((novel) => {
      bookStore.addBookId(novel.id);
    });
  } catch (error) {
    console.error("加载书籍数据失败:", error);
  }
};

onMounted(() => {
  getBooks(); // 调用 getBooks 而不是直接操作 novels
});

const filteredBooks = computed(() => {
  if (checkedtypes.value.length === 0) return novels.value;
  return novels.value.filter(
    (book) => checkedtypes.value.includes(book.type ? "本站推荐" : "用户导入") // 使用标签过滤
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
watch(
  filteredBooks,
  (newVal, oldVal) => {
    console.log("过滤后的书籍:", newVal);
  },
  { deep: true }
);
//对话框
const dialog = ref(false);

const dialogClose = () => {
  console.log("关闭");
};
//列表默认赋值为空
const form = reactive({
  file: "",
  status: true,
});
//默认列表
const fileList = ref([{}]);

//自定义上传
const uploadFile = (v) => {
  console.log(v.file);
  //缓存
  form.file = v.file;
};
//上传文件超出文件数量后的提示
const uploadExceed = () => {
  ElMessage.warning("请上传单个文件！");
};
//上传文件前的钩子,校验类型以及大小
const beforeUpload = (file) => {
  console.log(file);
  //类型限制
  const isTXT = file.type === "text/plain";
  //大小限制
  const isLIMIT = file.size / 1024 / 1024 < 30;
  if (!isTXT) {
    ElMessage.warning("上传的文件格式只能是txt格式！");
  }
  if (!isLIMIT) {
    ElMessage.warning("上传的文件大小不能超过30M！");
  }
  return isTXT && isLIMIT;
};
//文件列表移除
const uploadRemove = () => {
  ElMessage.warning("您已移除待提交文件");
};
//文件提交
const onSubmit = async () => {
  console.log(form);
  //数据交互
  let formdata = new FormData();
  formdata.append("file", form.file);
  //axios二次封装
  let { data } = await axios.post("import", formdata, {
    headers: { "Content-type": "multipart/form-data" },
  });
  if (data.code === 200) {
    ElNotification({
      title: "成功",
      message: "上传成功",
      duration: 2000,
      type: "success",
    });
  }
};
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
.uploading-button {
  position: absolute;
  top: 75px;
  right: 20px;
}
</style>
