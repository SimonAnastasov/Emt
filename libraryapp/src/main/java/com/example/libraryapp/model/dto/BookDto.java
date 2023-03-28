package com.example.libraryapp.model.dto;

import lombok.Data;

@Data
public class BookDto {
    private String name;
    private String category;
    private Long authorId;
    private int availableCopies;
    private int currentlyTaken;

    public BookDto(String name, String category, Long authorId, int availableCopies, int currentlyTaken) {
        this.name = name;
        this.category = category;
        this.authorId = authorId;
        this.availableCopies = availableCopies;
        this.currentlyTaken = currentlyTaken;
    }

    public BookDto() {

    }
}
