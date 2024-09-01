import { useTokenStore } from '@/stores/token'
import request from '@/utils/request.js'

export const booksService = () => {
    
    return request.get('/books')
}
