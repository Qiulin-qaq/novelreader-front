<script lang="ts" setup>
import { bookdetailService, cancelStarService, getBookChaptersService, starService } from '@/api/books';
import NavBar from '@/components/NavBar.vue';
import { onMounted, ref } from 'vue';
import 'element-plus/dist/index.css';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';

const isInBookShelf = ref(false);

const toggleBookShelf = async () => {
    try {
        console.log('bookId:', bookId)
        if (!isInBookShelf.value) {
            const starResponse = await starService(bookId)
            console.log(starResponse)
            if (starResponse.code===200) {
                ElMessage({
                    message: '已加入书架',
                    type: 'success'
                })
                isInBookShelf.value = true
            } else {
                throw new Error('加入书架失败');
            }

        }
        else {
            const cancelStarResponse = await cancelStarService(bookId)
            if (cancelStarResponse.code===200) {
                ElMessage({
                    message: '已从书架中移除',
                    type: 'warning'
                })
                isInBookShelf.value = false
            } else {
                throw new Error('移除书架失败');
            }

        }


    } catch (error) {
        // 请求失败时显示错误消息
        ElMessage.error('操作失败，请稍后重试');
        console.error("收藏操作失败：", error);
    }
};

const chaptersData = ref([]);
let bookname = ref('');
let bookDescription = ref('');
let author = ref('');
let img = ref('');
const route = useRoute();
const bookId = route.params.id;

const router = useRouter();
const startReading = () => {
    if (chaptersData.value.length > 0) {
        router.push({
            path: '/books/read',
            query: {
                book_id: bookId,
                relativeId: chaptersData.value[0].relativeId // 使用 chaptersData 的第一个 relativeId
            }
        });
    } else {
        ElMessage.error('章节数据尚未加载');
    }
};

const bookdetail = async () => {

    try { // 获取书籍详情
        const bookresponse = await bookdetailService(bookId);
        const bookData = bookresponse.data[0];


        isInBookShelf.value = bookData.isInBookShelf || false;

        img.value = bookData.picture;
        bookDescription.value = bookData.description || "无描述";
        author.value = bookData.author || "未知作者";
        bookname.value = bookData.title || "无标题";
    } catch (err) {
        console.log(err)
    }

}


// 处理表格行点击事件
const handleRowClick = (row) => {
    router.push({
        path: '/books/read',
        query: {
            book_id: bookId,
            relativeId: row.relativeId // 获取点击行的 relativeId
        }
    });
};

const chaptersdetail = async () => {
    try {
        // 获取章节信息
        const chaptersresponse = await getBookChaptersService(bookId);


        chaptersData.value = chaptersresponse.data;

        console.log(chaptersData.value)
        console.log(chaptersData.value[0].relativeId)
    } catch (err) {
        console.log(err)
    }
}

onMounted(() => {
    bookdetail();
    chaptersdetail()
    toggleBookShelf
})
</script>



<template>
    <NavBar></NavBar>

    <div style="display: flex; align-items: flex-start;" class="background"> <!-- 新增容器，并设置为 Flexbox -->
        <img src="/src/assets/png/logo.png" class="img">
        <!-- 添加 margin-right 来控制间距 -->

        <el-card class="card">

            <template #header>
                <div class="card-header">

                    <!-- <span>{{ bookname }}<strong>作者：</strong> {{ author }}</span> -->


                    <span class="book-title">{{ bookname }}</span>
                    <span class="author">作者：{{ author }}</span>
                </div>
            </template>
            <div class="book-description "> <!-- 用于限制内容的高度 -->
                {{ bookDescription }}

            </div>

            <div class="mb-4 button">

                <el-button :plain="true" @click="toggleBookShelf" type="primary" size="large">
                    {{ isInBookShelf ? '已加入书架' : '加入书架' }}
                </el-button>
                <el-button type="success" size="large" @click="startReading">开始阅读</el-button>

            </div>

        </el-card>


    </div>

    <el-divider />

    <div class="table-container">
        <el-table :data="chaptersData" style="width: 40%; height: 250px;" @row-click="handleRowClick">
            <el-table-column prop="relativeId" label="章节数" width="300" align="left" />
            <el-table-column prop="title" label="章节名" width="300" align="left" />

        </el-table>
    </div>



</template>

<style scope>
.background {
    background-image: url('../assets/png/5c880f7819c25.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    height: 500px;
}


.el-alert {
    margin: 20px 0 0;
}

.el-alert:first-child {
    margin: 0;
}

.img {
    width: 20%;
    margin-top: 100px;
    margin-left: 200px;
    margin-right: 200px;
}

.card {
    margin-top: 70px;
    width: 800px;
    height: 300px;
    /* 固定高度 */

}

.button {

    display: flex;
    justify-content: flex-end;

    margin-top: 10px;
    margin-right: 250px;
    gap: 80px;
}

.book-description {
    height: 150px;
    /* 使用父容器的高度 */
    overflow-y: auto;
    /* 超出内容时显示滚动条 */
    padding-right: 10px;
    /* 增加内边距以避免文字太靠近滚动条 */
    word-wrap: break-word;
    /* 自动换行 */
    white-space: normal;
    /* 正常换行 */
    max-height: 200px;
}

.table-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.card-header {
    display: flex;
    align-items: center;
    /* 垂直居中 */
    gap: 20px;
    /* 设置 title 和 author 之间的水平间距 */
}

.book-title {
    font-size: 1.5em;
    font-weight: bold;
    color: #333;
    /* 你可以根据需要调整字体样式 */
}

.author {
    font-size: 1.2em;
    color: #666;
    margin-left: 30px;
    /* 自动占位，推送到最右边 */
}
</style>
