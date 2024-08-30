<script setup>
import NavBar from '@/components/NavBar.vue';
const tableData = [
    {
        chapter: '第一回',
        name: 'Tom',

    },
    {
        chapter: '第一回',
        name: 'Tom',

    },
    {
        chapter: '第一回',
        name: 'Tom',

    },
    {
        chapter: '第一回',
        name: 'Tom',

    },
    {
        chapter: '第一回',
        name: 'Tom',

    },
    {
        chapter: '第一回',
        name: 'Tom',

    },
    {
        chapter: '第一回',
        name: 'Tom',

    },
    {
        chapter: '第一回',
        name: 'Tom',

    },
    {
        chapter: '第一回',
        name: 'Tom',

    },
    {
        chapter: '第一回',
        name: 'Tom',

    },
    {
        chapter: '第一回',
        name: 'Tom',

    },
]
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
                《活着》是中国当代作家余华创作的长篇虚构小说，首次发表于《收获》1992年第6期。
                《活着》讲述了在大时代背景下，随着内战、三反五反、大跃进、“文化大革命”等社会变革，徐福贵的人生和家庭不断经受着苦难，到了最后所有亲人都先后离他而去，仅剩下年老的他和一头老牛相依为命。小说以普通、平实的故事情节讲述了在急剧变革的时代中福贵的不幸遭遇和坎坷命运。
                <p><strong>作者：</strong> 余华</p>
                <p><strong>评分：</strong> ★★★★☆</p>
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
            <el-table-column prop="name" label="章节" width="300" align="left" />

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

.table-container{
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>
