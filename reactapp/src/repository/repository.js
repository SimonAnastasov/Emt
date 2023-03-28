import axios from "../custom-axios/axios"

const BookService = {
    fetchAllBooks: () => {
        return axios.get("/books");
    },
    fetchAllBookCategories: () => {
        return axios.get("/books/categories");
    },
    deleteBook: (id) => {
        return axios.delete(`/books/${id}/delete`);
    },
    changeCurrentlyTaken: (id, changeType) => {
        return axios.post(`/books/${id}/currentlyTaken/${changeType}`);
    },
}

export default BookService;