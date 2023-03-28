package com.example.libraryapp.model.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class BookWithIdNotFound extends RuntimeException {
    public BookWithIdNotFound(Long id) {
        super(String.format("Book with 'id' %d could not be found", id));
    }
}
