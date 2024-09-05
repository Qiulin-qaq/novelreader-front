<template>
    <div>
      <!-- 可拖动的机器人 -->
      <div
        ref="draggableMan"
        class="draggable-man"
        @mousedown="startDrag"
        @touchstart="startDrag"
        @click="showDialog = true"
      >
        <img src="@/assets/png/bot.gif" alt="Draggable Man" style="width: 100px;" />
      </div>
  
      <!-- 对话框 -->
      <div>
        <el-card 
          v-if="showDialog" 
          class="dialog" 
          :style="{ top: `${dialogPosition.top + 120}px`, left: `${dialogPosition.left + 10}px` }">
          
          <div class="bottom">
            <div class="line"></div>
            <div class="input-send">
              <el-input v-model="inputText" placeholder="请输入聊天内容..." />
            </div>
            <div v-if="answerVisible || loading" class="response-box" :style="{ maxHeight: 'auto', maxWidth: '200px', overflowY: 'auto', overflowX: 'auto' }">
                <p v-if="loading">正在加载中...</p>
                <p v-else>{{ answer }}</p>
            </div>
            
            <div class="button-group">
              <el-button type="primary" class="send" @click="handleTalk" :disabled="loading">发送</el-button>
              <el-button type="danger" class="cancel-button" @click="closeDialog" plain>取消</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import axios from 'axios';
  import { useTokenStore } from '@/stores/token';
  import { ElButton } from 'element-plus';
  
  // 控制对话框的显示和内容
  const showDialog = ref(false);
  const inputText = ref("");
  const answer = ref("");
  const answerVisible = ref(false);
  const loading = ref(false);
  
  const dialogPosition = ref({ top: 100, left: 100 });
  
  const draggableMan = ref<HTMLDivElement | null>(null);//创建一个响应式应用
  const tokenStore = useTokenStore();
  const token = tokenStore.token;
  
  const startDrag = (event: MouseEvent | TouchEvent) => {
    const man = draggableMan.value;
    if (!man) return;
    const startX = 'touches' in event ? event.touches[0].clientX : event.clientX;//如果触发触摸就记录x值，如果没有就触发点击
    const startY = 'touches' in event ? event.touches[0].clientY : event.clientY;
  
    const rect = man.getBoundingClientRect();//获取元素位置
    const offsetX = startX - rect.left;
    const offsetY = startY - rect.top;
  
    const moveAt = (clientX: number, clientY: number) => {
      man.style.left = `${clientX - offsetX}px`;
      man.style.top = `${clientY - offsetY}px`;
  
      dialogPosition.value = {
        top: clientY - offsetY,
        left: clientX - offsetX
      };
    };
  
    const onMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const clientY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      moveAt(clientX, clientY);
    };
  
    const stopDrag = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onMouseMove);//移除监听器
    };
  
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onMouseMove);
  
    document.addEventListener('mouseup', stopDrag, { once: true });
    document.addEventListener('touchend', stopDrag, { once: true });//触发一次后自动移除
  };
  
  // 关闭对话框
  const closeDialog = () => {
    showDialog.value = false;
  };
  
  const handleTalk = async () => {
    if (!inputText.value) {
      alert("请输入内容！");
      return;
    }
  
    loading.value = true;
    answerVisible.value = true;
  
    try {
      const data = { input: inputText.value };
  
      const response = await axios.post('/api/ai/generateRoast', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const result = response.data;
      if (result.code === 200) {
        answer.value = result.msg;
        inputText.value = "";
      } else {
        console.log("Failed to get a valid response", result);
      }
    } catch (error) {
      console.error("Error occurred while sending the request", error);
    } finally {
      loading.value = false;
    }
  };
  </script>
  
  <style scoped>
  .draggable-man {
    position: fixed;
    width: 50px;
    height: 50px;
    cursor: pointer;
    z-index: 1000;
    touch-action: none;
  }/*margin是元素和元素之间分离，padding是元素于内容之间的分离*/
  
  .dialog {
    position: fixed;
    background-color: white;
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 8px;
    z-index: 999;
  }
  
  .input-send {
    display: flex;
    align-items: center;
  }
  
  .button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
  
  .send {
    margin-right: 10px;
  }
  </style>
  