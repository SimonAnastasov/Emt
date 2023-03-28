package com.example.libraryapp.model;

import com.example.libraryapp.model.enumerations.BookCategory;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private BookCategory category;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private Author author;

    private int availableCopies = 0;

    private int currentlyTaken = 0;

    public Book(String name, BookCategory category, Author author, int availableCopies, int currentlyTaken) {
        this.name = name;
        this.category = category;
        this.author = author;
        this.availableCopies = availableCopies;
        this.currentlyTaken = currentlyTaken;
    }

    public Book() {

    }
}
