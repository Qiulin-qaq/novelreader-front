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
const isDarkMode = ref(false); // 新增一个状态控制黑夜模式

// 切换黑夜/白天模式的方法
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
};


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
    bookinfo.value.content = response.data.content.split('\n')
      .map(paragraph => `<p class="paragraph" style="text-indent: 2em; margin: 10px 0;">${paragraph}</p>`)
      .join('').replace(/\n\n/g, '<br><br>');



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

// 跳转上一章

const backChapter = () => {
  const currentIndex = chaptersData.value.findIndex(
    chapter => chapter.relativeId === parseInt(relativeId.value)
  );

  if (currentIndex === -1 || currentIndex === 0) {
    ElMessage.info('已经是第一章');
  } else {
    const previousChapterId = chaptersData.value[currentIndex - 1].relativeId;
    router.push({
      path: '/books/read',
      query: {
        book_id: book_id.value,
        relativeId: previousChapterId
      }
    });
  }
};

// 跳转下一章
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
watch(isDarkMode, (newVal) => {
  const color = newVal ? '#fff' : '#333';
  bookinfo.value.content = bookinfo.value.content.split('\n')
    .map(paragraph => `<p style="color: ${color}; text-indent: 2em; margin: 10px 0;">${paragraph}</p>`)
    .join('').replace(/\n\n/g, '<br><br>');
});

onMounted(() => {
  bookread();
  loadChapters();
});
</script>


<template>
  <div>
    <Bot />
  </div>

  <div :class="['container', isDarkMode ? 'dark-mode' : 'light-mode']">
    <el-card :class="isDarkMode ? 'dark-mode' : 'light-mode'">
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
      <div :class="['content', isDarkMode ? 'dark-mode' : 'light-mode']" v-html="bookinfo.content"></div>
    </el-card>
    <!-- 垂直排列的按钮组 -->
    <div class="button-group">

      <svg @click="backChapter" t="1725543274047" class="icon" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="6354" width="32" height="32">
        <path
          d="M512 64C264.8 64 64 264.8 64 512s200.8 448 448 448 448-200.8 448-448S759.2 64 512 64z m158.4 674.4L625.6 784l-272-272 272-272 45.6 45.6L444 512l226.4 226.4z"
          p-id="6355"></path>
      </svg>

      <svg t="1725448863092" class="icon" @click="nextChapter" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="4247" width="32" height="32">
        <path
          d="M512 64C264.8 64 64 264.8 64 512s200.8 448 448 448 448-200.8 448-448S759.2 64 512 64zM398.4 784l-45.6-45.6L580 512 353.6 285.6l45.6-45.6 272 272-272.8 272z"
          p-id="4248"></path>
      </svg>

      <svg t="1725456162083" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="6493" width="32" height="32" @click="backtoDetail">
        <path
          d="M512 64.050782c60.495816 0 119.153774 11.836583 174.345794 35.181267 53.335742 22.558785 101.245915 54.864562 142.401244 96.01989s73.461105 89.066525 96.01989 142.401244c23.344684 55.19202 35.181267 113.851001 35.181267 174.345794 0 60.494793-11.836583 119.153774-35.181267 174.345793-22.558785 53.334719-54.864562 101.245915-96.01989 142.401244s-89.066525 73.461105-142.401244 96.019891c-55.19202 23.344684-113.851001 35.181267-174.345794 35.181267s-119.153774-11.836583-174.345794-35.181267c-53.335742-22.558785-101.245915-54.864562-142.401244-96.019891S121.791857 739.679489 99.233072 686.34477c-23.344684-55.19202-35.181267-113.851001-35.181267-174.345793 0-60.495816 11.836583-119.153774 35.181267-174.345794 22.558785-53.335742 54.864562-101.245915 96.01989-142.401244s89.066525-73.461105 142.401244-96.01989c55.19202-23.344684 113.849978-35.181267 174.345794-35.181267m0-51.16531c-275.653107 0-499.114528 223.461421-499.114528 499.114528S236.346893 1011.114528 512 1011.114528s499.114528-223.461421 499.114528-499.114528S787.653107 12.885472 512 12.885472z"
          fill="" p-id="6494"></path>
        <path
          d="M786.310529 540.674063c-9.080819 9.135054-23.858384 9.135054-32.992415 0L512.162706 298.765501 310.500776 501.072113h14.669095c25.791409 0 46.693462 21.063735 46.693462 46.963615v24.985044h0.054235l0.160659 141.318586c1.558495 15.368012 7.469112 19.452028 24.502044 20.633946 19.773346-1.774413 21.976524-8.705266 22.138206-34.819017l-0.054235-58.569953c0.215918-25.684986 21.010523-46.532803 46.641273-46.532803h23.320125v-0.591471l46.747697-0.107447v0.697895h23.320125c25.791409 0 46.74872 21.010523 46.74872 46.963614v24.985045h0.053212l0.053212 28.479634 0.053212-6.824429c0 36.539194 0 44.544519 22.997783 46.317909 23.481807-1.934049 23.696702-10.156314 23.696702-46.317909l-0.322341 46.641274h0.376576l-0.214894-188.336436c0-12.94994 10.477632-23.480784 23.373337-23.480784 12.896728 0 23.320125 10.530844 23.320125 23.480784l0.161682 163.350368h-0.161682v24.932856c0 25.953092-20.902052 47.015803-46.693462 47.015803h-46.694485c-25.52228 0-46.048779-20.578688-46.586015-46.103014l-0.054235-59.912532-0.160659-5.963828c0 0.591471 0.160659 1.020236 0.160659 1.664919l-0.053212-30.573319h-7.254218l6.5553 0.053212 0.591471 28.855188c-1.181919-22.998807-6.502088-27.942399-28.693506-28.855188l-37.238112 0.053212c-20.903076 0.966001-26.114774 5.748934-27.296693 26.006303l0.053212 42.826388h-0.160659v24.932856c0 25.953092-20.903076 47.015803-46.748721 47.015803h-46.694485c-25.469068 0-45.941332-20.525476-46.478567-46.048779l-0.215918-188.819436-12.08934 0.054235 11.44568 0.052188 0.160659 31.541367c-0.537236-25.738198-4.459568-30.68179-28.210505-31.594579l-40.622186 0.106424c-6.5553 0.485047-13.219069-1.503237-18.162662-6.555299-9.135054-9.134031-9.135054-24.019043 0-33.20731l256.093633-256.898974c0.591471-0.697895 0.859577-1.611707 1.505283-2.25639 9.134031-9.188266 23.910573-9.188266 33.045627 0l0.376577 0.375553 257.598916 258.405281c9.137101 9.18929 9.137101 24.073278 0.002046 33.261545z m-180.705641 194.783265l11.498892-0.053212-11.498892-0.053212v0.106424z m-140.190903-68.080561l0.537236-25.898857h-0.591471l0.054235 25.898857z m-93.334735 68.080561l11.498892-0.053212-11.498892-0.053212v0.106424z m-47.393403-156.417469c0.107447 4.78191 0.107447 10.209526 0.107447 16.549931l-0.107447-16.549931z"
          fill="" p-id="6495"></path>
      </svg>
      <svg v-if="isDarkMode" @click="toggleDarkMode" t="1725527258100" class="icon" viewBox="0 0 1024 1024"
        version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4391" width="32" height="32">
        <path
          d="M510 192a32 32 0 0 1-32-32V80a32 32 0 1 1 64 0v80a32 32 0 0 1-32 32z m224.864 93.136a32 32 0 0 1 0-45.248l56.576-56.576a32 32 0 1 1 45.248 45.248l-56.56 56.56a32 32 0 0 1-45.264 0.016z m93.136 224.864a32 32 0 0 1 32-32h80a32 32 0 1 1 0 64h-80a32 32 0 0 1-32-32z m-93.136 224.864a32 32 0 0 1 45.248 0l56.56 56.56a32 32 0 1 1-45.248 45.248l-56.576-56.56a32 32 0 0 1 0.016-45.248zM510 828a32 32 0 0 1 32 32v80a32 32 0 1 1-64 0v-80a32 32 0 0 1 32-32z m-224.864-93.136a32 32 0 0 1 0 45.248l-56.56 56.56a32 32 0 0 1-45.248-45.248l56.576-56.56a32 32 0 0 1 45.232 0zM192 510a32 32 0 0 1-32 32H80a32 32 0 1 1 0-64h80a32 32 0 0 1 32 32z m93.136-224.864a32 32 0 0 1-45.248 0l-56.576-56.56a32 32 0 0 1 45.248-45.248l56.56 56.576a32 32 0 0 1 0.016 45.232zM510 272c132.544 0 240 107.456 240 240 0 132.544-107.456 240-240 240-132.544 0-240-107.456-240-240 0-132.544 107.456-240 240-240z m0 64c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176z"
          fill="#000000" p-id="4392"></path>
      </svg>
      <svg v-else @click="toggleDarkMode" t="1725527280134" class="icon" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="5374" width="32" height="32">
        <path
          d="M426.666667 298.666667c0 119.466667 72.533333 230.4 187.733333 277.333333s243.2 21.333333 324.266667-68.266667v4.266667c0 234.666667-192 426.666667-426.666667 426.666667S85.333333 746.666667 85.333333 512 277.333333 85.333333 512 85.333333h4.266667C460.8 140.8 426.666667 217.6 426.666667 298.666667z m-256 213.333333c0 157.866667 106.666667 294.4 260.266666 332.8s311.466667-34.133333 384-170.666667c-128 29.866667-264.533333-8.533333-358.4-102.4S320 341.333333 349.866667 209.066667C238.933333 268.8 170.666667 384 170.666667 512z"
          fill="#000F2F" fill-opacity=".6" p-id="5375"></path>
      </svg>




    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  height: 100%;
  padding: 20px;
  height: 100%;
  background-color: rgb(187, 191, 187);
  color: #333;



}

.dark-mode {
  background-color: #333 !important;
  /* 夜间模式背景色 */
  color: #fff !important;
  /* 夜间模式字体颜色 */
}

.paragraph {
  text-indent: 2em;
  margin: 10px 0;
  color: inherit;
  /* 继承父元素的颜色 */
}

.dark-mode .paragraph {
  color: #fff;
}

.light-mode .paragraph {
  color: #333;
}

.el-card {
  flex: 0 1 60%;
  /* 卡片的大小和可伸缩性 */
  margin-right: 20px;
  max-width: 1000px;



}

.content {
  font-family: 'Arial', sans-serif;
  font-size: 20px;
  line-height: 1.8;
  text-align: justify;
  padding: 20px;
  word-spacing: 10px;
  letter-spacing: 0.5px;
  height: calc(100vh - 200px);
  /* 根据窗口高度动态计算内容高度 */
  overflow-y: auto;

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
