import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTokenStore = defineStore('token', () => {
  const token = ref('')

  // 设置 token 并同步到 localStorage
  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)  // 手动同步到 localStorage
  }

  // 获取 token
  const getToken = () => {
    if (!token.value) {
      token.value = localStorage.getItem('token') || ''
    }
    return token.value
  }

  // 移除 token 并清除 localStorage 中的值
  const removeToken = () => {
    token.value = ''
    localStorage.removeItem('token')  // 从 localStorage 中删除 token
  }

  return {
    token,
    setToken,
    getToken,
    removeToken,
  }
})
