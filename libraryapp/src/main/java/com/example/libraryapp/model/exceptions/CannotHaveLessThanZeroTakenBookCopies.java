package com.example.libraryapp.model.exceptions;

public class CannotHaveLessThanZeroTakenBookCopies extends RuntimeException {
    public CannotHaveLessThanZeroTakenBookCopies() {
        super("Cannot have less than 0 taken copies of the book");
    }
}
