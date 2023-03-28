package com.example.libraryapp.service;

import com.example.libraryapp.model.Author;

import java.util.List;

public interface AuthorService {
    public List<Author> findAll();
    public Author findById(Long id);
}
