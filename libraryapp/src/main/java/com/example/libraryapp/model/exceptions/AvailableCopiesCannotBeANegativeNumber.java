package com.example.libraryapp.model.exceptions;

public class AvailableCopiesCannotBeANegativeNumber extends RuntimeException {
    public AvailableCopiesCannotBeANegativeNumber() {
        super("Book's available copies cannot be a negative number");
    }
}
