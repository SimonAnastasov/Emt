package com.example.libraryapp.model.exceptions;

public class AllAvailableBookCopiesHaveAlreadyBeenTaken extends RuntimeException{
    public AllAvailableBookCopiesHaveAlreadyBeenTaken(int availableCopies) {
        super(String.format("All %d available copies for this book have already been taken", availableCopies));
    }
}
