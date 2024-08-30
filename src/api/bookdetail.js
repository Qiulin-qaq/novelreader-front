import { useTokenStore } from '@/stores/token'
import request from '@/utils/request.js'

export const bookdetailService = () => {
    
    return request.get('/book/:id')
}
