import axios from "../custom-axios/axios"

const BookService = {
    fetchAllBooks: () => {
        return axios.get("/books");
    },
    fetchAllBookCategories: () => {
        return axios.get("/books/categories");
    },
    saveOrEditBook: (id, name, authorId, category, availableCopies, currentlyTaken) => {
        const requestBody = {
            name,
            authorId,
            category,
            availableCopies,
            currentlyTaken
        }

        if (id !== undefined && typeof id === 'number')
            return axios.post(`/books/${id}/edit`, requestBody);
        else
            return axios.post(`/books`, requestBody);
    },
    deleteBook: (id) => {
        return axios.delete(`/books/${id}/delete`);
    },
    changeCurrentlyTaken: (id, changeType) => {
        return axios.post(`/books/${id}/currentlyTaken/${changeType}`);
    },
    fetchAllAuthors: () => {
        return axios.get("/authors");
    }
}

export default BookService;