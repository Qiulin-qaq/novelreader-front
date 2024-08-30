<script setup>
import { bookdetailService } from '@/api/bookdetail';
import NavBar from '@/components/NavBar.vue';
import { useTokenStore } from '@/stores/token';
import { ref } from 'vue';
const chaptersData = ref([
])
const bookname = ref('')
const bookDescription = ref('')
const author = ref('')



const bookdetail = async () => {
    let response = await bookdetailService()
    chaptersData.value = response.data.chapters
    bookDescription = response.data.bookDescription
    author = response.data.author
    bookname = response.data.bookname


}

bookdetail()
</script>

<template>
    <NavBar></NavBar>
    <div style="display: flex; align-items: flex-start;"> <!-- 新增容器，并设置为 Flexbox -->
        <img src="C:\Users\32602\Desktop\OIP.jpg" class="img">
        <!-- 添加 margin-right 来控制间距 -->
        <el-card class="card">

            <template #header>
                <div class="card-header">
                    <span>书名</span>
                </div>
            </template>
            <div class="book-description"> <!-- 用于限制内容的高度 -->
                {{ bookDescription }}
                <p><strong>作者：</strong> {{ author }}</p>

            </div>

        </el-card>


    </div>
    <div class="mb-4 button">

        <el-button type="primary" size="large">加入书架</el-button>
        <el-button type="success" size="large">开始阅读</el-button>

    </div>
    <el-divider />

    <div class="table-container">
        <el-table :data="tableData" style="width: 40%; height: 250px;">
            <el-table-column prop="chapter" label="章节数" width="300" align="left" />
            <el-table-column prop="name" label="章节名" width="300" align="left" />

        </el-table>
    </div>



</template>

<style scope>
.img {
    width: 20%;
    margin-top: 50px;
    margin-left: 200px;
    margin-right: 200px;
}

.card {
    margin-top: 50px;
    width: 800px;
    height: 300px;
    /* 固定高度 */

}

.button {

    display: flex;
    justify-content: flex-end;
    /* 右对齐 */
    margin-top: 10px;
    margin-right: 400px;
    gap: 80px;
}

.book-description {
    height: 100%;
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
</style>
