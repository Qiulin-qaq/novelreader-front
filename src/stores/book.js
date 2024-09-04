import { defineStore } from "pinia";
import { ref } from 'vue'
export const useBookStore = defineStore('book', () => {
    const bookIds = ref([])

    const addBookId = (id) => {
        if (!bookIds.value.includes(id)) {
            bookIds.value.push(id)
        }
    }
    const removeBookId = (id) => {
        bookIds.value = bookIds.value.filter(bookId => bookId !== id)
    }

    const getBookId = () => {
        return bookIds.value
    }

    return {
        bookIds,
        addBookId,
        getBookId,
        removeBookId
    }
}, {
    persist: true  // 启用状态持久化
})