// src/stores/fontSizeStore.js
import { defineStore } from 'pinia';

export const useFontSizeStore = defineStore('fontSize', {
  state: () => ({
    fontSize: '16px', // 默认字体大小
  }),
  actions: {
    setFontSize(size) {
      this.fontSize = size;
      document.documentElement.style.setProperty('--font-size', size);//改变全局大小
    }
  }
});
