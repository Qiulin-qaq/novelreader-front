<script setup>
import { bookreadService } from '@/api/books';
import { ElMessage } from 'element-plus';
import { onMounted } from 'vue';
import { ref } from 'vue'


const bookinfo = ref({
    title: '',
    content: ''

})
const book_id = 1
const chapter_id = 1
const bookread = async () => {
    try {
        
        let response = await bookreadService(book_id, chapter_id)

        // 解构 response 中的 data 对象
        bookinfo.value.title = response.data.title

        // 处理换行符，将 \n\n 替换为 <br>
        bookinfo.value.content = response.data.content.replace(/\n\n/g, '<br><br>');
       
    } catch (err) {
        ElMessage.error('加载书籍数据失败', err)
        bookinfo.value.title = '加载失败';
        bookinfo.value.content = '无法加载内容';
    }



}


onMounted(() => {
    bookread()
})

</script>

<template>

    <div class="container body">
        <el-card style="max-width: 1000px;">
            <template #header>
                <div class="card-header">
                    <span @click="router.back()"><svg t="1725347941906" class="icon" viewBox="0 0 1024 1024"
                            version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1448" width="16" height="16">
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
    </div>
</template>

<style scoped>
.container {
    display: flex;
    background-color: rgb(187, 191, 187);

    height: 100vh;
    /* 可选：让容器占满视口高度 */
}

.el-card {
    width: 100%;

    margin: 0 auto;
    /* 确保卡片在父容器内居中 */
}

.content {
    font-family: 'Arial', sans-serif;
    /* 字体 */
    font-size: 20px;
    /* 字体大小 */
    line-height: 1.6;
    /* 行高，增加可读性 */
    color: #333;
    /* 字体颜色 */
    text-align: justify;
    /* 文字对齐方式 */
    padding: 20px;
    /* 内边距，增加内容与边框之间的距离 */
    word-spacing: 10px;
    /* 单词间距 */
    letter-spacing: 0.5px;
    /* 字母间距 */
}
</style>
