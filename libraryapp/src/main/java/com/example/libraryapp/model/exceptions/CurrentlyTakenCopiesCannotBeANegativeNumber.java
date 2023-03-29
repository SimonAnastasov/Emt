package com.example.libraryapp.model.exceptions;

public class CurrentlyTakenCopiesCannotBeANegativeNumber extends RuntimeException {
    public CurrentlyTakenCopiesCannotBeANegativeNumber() {
        super("Book's currently taken copies cannot be a negative number");
    }
}
