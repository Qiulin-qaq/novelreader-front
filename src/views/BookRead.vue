<script setup>

import { bookreadService } from '@/api/books';
import { ElMessage } from 'element-plus';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getBookChaptersService } from '@/api/books'

const bookinfo = ref({
  title: '',
  content: '',
});

const book_id = ref(null);
const relativeId = ref(null);

const route = useRoute(); // 获取路由对象
const router = useRouter()
const chaptersData = ref([]);

const bookread = async () => {
  try {
    // 获取 URL 查询参数
    book_id.value = route.query.book_id;
    relativeId.value = route.query.relativeId;

    console.log('book_id:', book_id.value); // 检查输出 book_id 是否正确
    console.log('relativeId:', relativeId.value); // 检查输出 relative_id 是否正确

    if (!book_id.value || !relativeId.value) {
      throw new Error('book_id 或 relativeId 缺失');
    }

    let response = await bookreadService(book_id.value, relativeId.value);

    // 解构 response 中的 data 对象
    bookinfo.value.title = response.data.title;

    // 处理换行符，将 \n\n 替换为 <br>
    bookinfo.value.content = response.data.content.replace(/\n\n/g, '<br><br>');
  } catch (err) {
    ElMessage.error('加载书籍数据失败');
    bookinfo.value.title = '加载失败';
    bookinfo.value.content = '无法加载内容';
    console.log(err);
  }
};

const loadChapters = async () => {
  try {
    // 获取所有章节列表
    const chaptersResponse = await getBookChaptersService(book_id.value);
    chaptersData.value = chaptersResponse.data;
  } catch (err) {
    ElMessage.error('章节数据加载失败');
    console.log(err);
  }
};

// 实现“下一章”功能
const nextChapter = () => {
  const currentIndex = chaptersData.value.findIndex(
    chapter => chapter.relativeId === parseInt(relativeId.value)
  );

  if (currentIndex === -1 || currentIndex === chaptersData.value.length - 1) {
    ElMessage.info('已经是最后一章');
  } else {
    const nextChapterId = chaptersData.value[currentIndex + 1].relativeId;
    router.push({
      path: '/books/read',
      query: {
        book_id: book_id.value,
        relativeId: nextChapterId
      }
    });
  }
};

// 返回books/{id}页
const backtoDetail = () => {
  router.push({
    path: `/books/${book_id.value}`, // 使用动态书籍ID
  });
};

// 监听路由参数的变化，更新页面内容
watch(
  () => route.query.relativeId,
  () => {
    bookread();
  }
);

onMounted(() => {
  bookread();
  loadChapters();
});
</script>


<template>
  <div class="container">
    <el-card style="max-width: 1000px;">
      <template #header>
        <div class="card-header">
          <span @click="router.back()" class="back">
            <svg t="1725347941906" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="1448" width="16" height="16">
              <path
                d="M624.788992 204.047974 585.205965 164.464026 219.560038 530.185011 585.205965 895.864013 624.788992 856.280986 298.663014 530.16105Z"
                p-id="1449">
              </path>
            </svg>
            {{ bookinfo.title }}
          </span>
        </div>
      </template>
      <!-- 小说内容 -->
      <div class="content" v-html="bookinfo.content"></div>
    </el-card>
    <!-- 垂直排列的按钮组 -->
    <div class="button-group">
      <svg t="1725448863092" class="icon" @click="nextChapter" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="4247" width="32" height="32">
        <path
          d="M512 64C264.8 64 64 264.8 64 512s200.8 448 448 448 448-200.8 448-448S759.2 64 512 64zM398.4 784l-45.6-45.6L580 512 353.6 285.6l45.6-45.6 272 272-272.8 272z"
          p-id="4248"></path>
      </svg>

      <!-- <svg t="1725455287334" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="6282" width="32" height="32" @click="backtoDetail">
        <path
          d="M790.4 992H233.6c-38.4 0-70.4-32-70.4-70.4V566.4H86.4c-6.4 0-12.8-3.2-16-6.4-32-32-32-83.2 0-115.2L457.6 57.6c32-32 83.2-32 115.2 0L960 444.8c32 32 32 83.2 0 115.2-3.2 3.2-9.6 6.4-16 6.4h-76.8v355.2C864 960 832 992 790.4 992zM96 515.2h89.6c12.8 0 25.6 9.6 25.6 25.6v380.8c0 12.8 9.6 22.4 22.4 22.4h556.8c12.8 0 22.4-9.6 22.4-22.4V540.8c0-12.8 9.6-25.6 25.6-25.6H928c6.4-12.8 6.4-28.8-6.4-38.4L534.4 89.6c-12.8-12.8-32-12.8-44.8 0L102.4 476.8c-9.6 9.6-12.8 25.6-6.4 38.4z"
          p-id="6283"></path>
      </svg> -->

      <svg t="1725456162083" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="6493" width="32" height="32" @click="backtoDetail">
        <path
          d="M512 64.050782c60.495816 0 119.153774 11.836583 174.345794 35.181267 53.335742 22.558785 101.245915 54.864562 142.401244 96.01989s73.461105 89.066525 96.01989 142.401244c23.344684 55.19202 35.181267 113.851001 35.181267 174.345794 0 60.494793-11.836583 119.153774-35.181267 174.345793-22.558785 53.334719-54.864562 101.245915-96.01989 142.401244s-89.066525 73.461105-142.401244 96.019891c-55.19202 23.344684-113.851001 35.181267-174.345794 35.181267s-119.153774-11.836583-174.345794-35.181267c-53.335742-22.558785-101.245915-54.864562-142.401244-96.019891S121.791857 739.679489 99.233072 686.34477c-23.344684-55.19202-35.181267-113.851001-35.181267-174.345793 0-60.495816 11.836583-119.153774 35.181267-174.345794 22.558785-53.335742 54.864562-101.245915 96.01989-142.401244s89.066525-73.461105 142.401244-96.01989c55.19202-23.344684 113.849978-35.181267 174.345794-35.181267m0-51.16531c-275.653107 0-499.114528 223.461421-499.114528 499.114528S236.346893 1011.114528 512 1011.114528s499.114528-223.461421 499.114528-499.114528S787.653107 12.885472 512 12.885472z"
          fill="" p-id="6494"></path>
        <path
          d="M786.310529 540.674063c-9.080819 9.135054-23.858384 9.135054-32.992415 0L512.162706 298.765501 310.500776 501.072113h14.669095c25.791409 0 46.693462 21.063735 46.693462 46.963615v24.985044h0.054235l0.160659 141.318586c1.558495 15.368012 7.469112 19.452028 24.502044 20.633946 19.773346-1.774413 21.976524-8.705266 22.138206-34.819017l-0.054235-58.569953c0.215918-25.684986 21.010523-46.532803 46.641273-46.532803h23.320125v-0.591471l46.747697-0.107447v0.697895h23.320125c25.791409 0 46.74872 21.010523 46.74872 46.963614v24.985045h0.053212l0.053212 28.479634 0.053212-6.824429c0 36.539194 0 44.544519 22.997783 46.317909 23.481807-1.934049 23.696702-10.156314 23.696702-46.317909l-0.322341 46.641274h0.376576l-0.214894-188.336436c0-12.94994 10.477632-23.480784 23.373337-23.480784 12.896728 0 23.320125 10.530844 23.320125 23.480784l0.161682 163.350368h-0.161682v24.932856c0 25.953092-20.902052 47.015803-46.693462 47.015803h-46.694485c-25.52228 0-46.048779-20.578688-46.586015-46.103014l-0.054235-59.912532-0.160659-5.963828c0 0.591471 0.160659 1.020236 0.160659 1.664919l-0.053212-30.573319h-7.254218l6.5553 0.053212 0.591471 28.855188c-1.181919-22.998807-6.502088-27.942399-28.693506-28.855188l-37.238112 0.053212c-20.903076 0.966001-26.114774 5.748934-27.296693 26.006303l0.053212 42.826388h-0.160659v24.932856c0 25.953092-20.903076 47.015803-46.748721 47.015803h-46.694485c-25.469068 0-45.941332-20.525476-46.478567-46.048779l-0.215918-188.819436-12.08934 0.054235 11.44568 0.052188 0.160659 31.541367c-0.537236-25.738198-4.459568-30.68179-28.210505-31.594579l-40.622186 0.106424c-6.5553 0.485047-13.219069-1.503237-18.162662-6.555299-9.135054-9.134031-9.135054-24.019043 0-33.20731l256.093633-256.898974c0.591471-0.697895 0.859577-1.611707 1.505283-2.25639 9.134031-9.188266 23.910573-9.188266 33.045627 0l0.376577 0.375553 257.598916 258.405281c9.137101 9.18929 9.137101 24.073278 0.002046 33.261545z m-180.705641 194.783265l11.498892-0.053212-11.498892-0.053212v0.106424z m-140.190903-68.080561l0.537236-25.898857h-0.591471l0.054235 25.898857z m-93.334735 68.080561l11.498892-0.053212-11.498892-0.053212v0.106424z m-47.393403-156.417469c0.107447 4.78191 0.107447 10.209526 0.107447 16.549931l-0.107447-16.549931z"
          fill="" p-id="6495"></path>
      </svg>


    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  /* 水平居中 */

  height: 100vh;
  /* 确保容器占满视口高度 */
  background-color: rgb(187, 191, 187);
  /* 背景色 */
  padding: 20px;
}

.el-card {
  flex: 0 1 60%;
  /* 卡片的大小和可伸缩性 */
  margin-right: 20px;
}

.content {
  font-family: 'Arial', sans-serif;
  font-size: 20px;
  line-height: 1.6;
  color: #333;
  text-align: justify;
  padding: 20px;
  word-spacing: 10px;
  letter-spacing: 0.5px;
}

.button-group {
  display: flex;
  flex-direction: column;
  /* 垂直排列 */
  justify-content: center;
  align-items: center;
  gap: 15px;
  /* 按钮之间的间距 */
  cursor: pointer;
}

.back {
  cursor: pointer;
}
</style>
