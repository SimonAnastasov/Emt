package com.example.libraryapp.model.exceptions;

public class BookNameCannotBeEmpty extends RuntimeException {
    public BookNameCannotBeEmpty() {
        super("The book's name cannot be empty");
    }
}
