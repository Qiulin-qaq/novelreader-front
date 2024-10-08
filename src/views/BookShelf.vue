<template>

  <div id="NavBar">
    <Navbar />
  </div>
  <div>
    <Bot />
  </div>
  <div class="background-blur">
    <div class="container">
      <el-button class="uploading-button" @click="dialog = true">上传小说</el-button>
    </div>
    <!-- draggable 允许拖拽 -->
    <el-dialog v-model="dialog" width="500" title="上传小说" draggable @close="dialogClose">
      <el-form label-width="80">
        <el-upload v-model:file-list="fileList" class="upload-demo" :http-request="uploadFile" :limit="1"
          :on-exceed="uploadExceed" :before-upload="beforeUpload" accept=".txt" :on-remove="uploadRemove">
          <el-button type="primary">点击选择文件</el-button>
          <template #tip>
            <div class="el-upload__tip">请上传.txt文件,大小不超过30M</div>
          </template>
        </el-upload>
      </el-form>
    </el-dialog>

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
        <img :src="book.picture || '/src/assets/png/logo.png'" style="width: 100%" alt="Cover Image" />
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import "element-plus/dist/index.css";
import Navbar from "@/components/NavBar.vue";
import { ref, computed, onMounted, reactive } from "vue";
import { booksshelfService } from "@/api/booksshelf";
import { useBookshelfStore } from "@/stores/bookshelf";
import { ElMessage, ElNotification } from "element-plus";
import axios from 'axios';
import { useTokenStore } from "@/stores/token";  // 引入 tokenStore
import Bot from '@/components/Bot.vue'

const novels = ref([]); // 初始化为空数组
const checkedtypes = ref([]);
const checkAll = ref(false);
const statuses = ["本站推荐", "用户导入"]; // 代表两种类型
const isIndeterminate = computed(() => checkedtypes.value.length > 0 && checkedtypes.value.length < statuses.length);
const bookStore = useBookshelfStore();
const tokenStore = useTokenStore();  // 创建 tokenStore 的实例

// 从后端获取书籍数据
const getBooks = async () => {
  try {
    const response = await booksshelfService();
    novels.value = response.data.map((book) => ({
      ...book,
      typeLabel: book.status ? "本站推荐" : "用户导入", // 添加标签转换
    }));
    novels.value.forEach((novel) => {
      bookStore.addBookId(novel.id);
    });
  } catch (error) {
    console.error("加载书籍数据失败:", error);
  }
};

onMounted(() => {
  getBooks(); // 调用 getBooks
});

const filteredBooks = computed(() => {
  if (checkedtypes.value.length === 0) return novels.value;
  return novels.value.filter((book) =>
    checkedtypes.value.includes(book.status ? "本站推荐" : "用户导入")
  );
});

const handleCheckAllChange = (value) => {
  checkedtypes.value = value ? statuses.slice() : []; // 复制或清空
};

const handleCheckedtypesChange = (value) => {
  checkAll.value = value.length === statuses.length;
};

// 对话框
const dialog = ref(false);

const dialogClose = () => {
  console.log("关闭对话框");
};

// 表单处理
const form = reactive({
  file: "",
  status: "false",  // 这里固定为 "false"
});

// 默认文件列表
const fileList = ref([]);

// 自定义上传逻辑
const uploadFile = async ({ file, onSuccess, onError }) => {
  console.log("选择的文件：", file);
  // 创建 FormData 进行上传
  let formdata = new FormData();
  formdata.append("file", file);
  formdata.append("status", "false");  // 强制设置 status 为字符串 "false"

  try {
    // 获取 token
    const token = tokenStore.getToken();  // 从 pinia 的 tokenStore 中获取 token

    if (!token) {
      ElMessage.error("Token 未找到，请重新登录");
      return;
    }

    // 发送 POST 请求，添加 Authorization 请求头
    const response = await axios.post("/api/books/import", formdata, {
      headers: {
        "Authorization": `Bearer ${token}`,  // 添加 Token 到请求头
        "Content-Type": "multipart/form-data",  // 确保 Content-Type 是正确的
      },
    });

    // 检查响应是否成功
    if (response.data && response.data.code === 200) {
      ElNotification({
        title: "成功",
        message: "上传成功",
        duration: 2000,
        type: "success",
      });
      onSuccess(response.data);  // 调用上传成功回调

      // 在上传成功后调用 getBooks 来同步更新书籍列表
      await getBooks();

    } else {
      ElMessage.error("上传失败，服务器返回错误信息");
      onError();  // 调用上传失败回调
    }

  } catch (error) {
    console.error("上传请求失败：", error);
    onError();  // 调用上传失败回调
    if (error.response) {
      // 如果服务器返回了错误响应
      ElMessage.error(`上传失败：${error.response.data.message || '未知错误'}`);
    } else {
      ElMessage.error("上传失败，请重试");
    }
  }
};


// 上传文件超出文件数量提示
const uploadExceed = () => {
  ElMessage.warning("请上传单个文件！");
};

// 上传文件前的钩子，用于校验类型和大小
const beforeUpload = (file) => {
  const isTXT = file.type === "text/plain";
  const isLIMIT = file.size / 1024 / 1024 < 30;
  if (!isTXT) {
    ElMessage.warning("上传的文件格式只能是txt格式！");
  }
  if (!isLIMIT) {
    ElMessage.warning("上传的文件大小不能超过30M！");
  }
  return isTXT && isLIMIT;
};

// 文件移除
const uploadRemove = () => {
  ElMessage.warning("您已移除待提交文件");
};
</script>

<style scoped>
.books-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 50px;
  row-gap: 90px;
  margin-left: 100px;
  margin-top: 60px;
  padding-bottom: 50px;

  padding: 0px;
  border-radius: 10px;
}

.el-card {
  height: 300px;
  width: 300px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.el-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
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
}

.checkbox-container {
  margin-top: 30px;
  margin-left: 300px;
  background-color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 50%;
}

.checkbox-container .el-checkbox {
  margin-right: 20px;
  font-size: 16px;
  color: #333;
}

.checkbox-container .el-checkbox:hover {
  color: #007bff;
}

.uploading-button {
  position: absolute;
  top: 30px;
  right: 200px;

}


/* 背景图片容器 */
.background-blur {
  position: relative;
}

/* 卡片背景样式 */
.background {
  background-image: url('https://revo.zongheng.com/www/2024/images/75caf4c.png');
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  padding: 20px;
  margin-top: 70px;
  width: 100;
}

/* 背景模糊效果 */
.background-blur::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('https://revo.zongheng.com/www/2024/images/75caf4c.png');
  background-size: cover;
  background-position: center;
  filter: blur(10px);
  z-index: -1;
}
</style>
