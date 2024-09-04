
import request from '@/utils/request.js'

export const booksService = () => {

    return request.get('/books')
}

export const bookreadService = (book_id, relativeId) => {
    return request.get('/books/read', {
        params: {
            book_id: book_id,
            relativeId: relativeId
        }

    });
};

export const bookdetailService = (bookId) => {

    return request.get(`/books/${bookId}`)
}


export const getBookChaptersService = (bookId) => {
    return request.get(`/chapters/novel/${bookId}`)

}