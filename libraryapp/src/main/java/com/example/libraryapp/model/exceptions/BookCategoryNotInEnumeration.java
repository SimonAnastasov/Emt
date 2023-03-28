package com.example.libraryapp.model.exceptions;

import com.example.libraryapp.model.enumerations.BookCategory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.Arrays;
import java.util.stream.Collectors;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class BookCategoryNotInEnumeration extends RuntimeException {
    public BookCategoryNotInEnumeration() {
        super(String.format("The book's 'category' must be one of: [%s]",
                Arrays.stream(BookCategory.values())
                .map(Enum::name)
                .collect(Collectors.joining(", "))));
    }
}
