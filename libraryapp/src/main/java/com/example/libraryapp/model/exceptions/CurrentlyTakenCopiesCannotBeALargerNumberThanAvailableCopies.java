package com.example.libraryapp.model.exceptions;

public class CurrentlyTakenCopiesCannotBeALargerNumberThanAvailableCopies extends RuntimeException {
    public CurrentlyTakenCopiesCannotBeALargerNumberThanAvailableCopies() {
        super("Book's currently taken copies cannot be a larger number than book's available copies");
    }
}
