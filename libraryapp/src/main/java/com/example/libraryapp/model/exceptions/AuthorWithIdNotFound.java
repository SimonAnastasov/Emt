package com.example.libraryapp.model.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class AuthorWithIdNotFound extends RuntimeException {
    public AuthorWithIdNotFound(Long id) {
        super(String.format("Author with 'authorId' %d could not be found", id));
    }
}
