
import request from '@/utils/request.js'

export const booksService = () => {
    
    return request.get('/books')
}

export const bookreadService = (book_id, chapter_id) => {
    return request.get('/books/read', {
        params: {
            book_id: book_id,
            chapter_id: chapter_id
        }
        
    });
};

export const bookdetailService = () => {

    return request.get('/book/${id}')
}
