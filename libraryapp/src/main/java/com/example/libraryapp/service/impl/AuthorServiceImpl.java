package com.example.libraryapp.service.impl;

import com.example.libraryapp.model.Author;
import com.example.libraryapp.model.exceptions.AuthorWithIdNotFound;
import com.example.libraryapp.repository.AuthorRepository;
import com.example.libraryapp.service.AuthorService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository authorRepository;

    public AuthorServiceImpl(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    @Override
    public List<Author> findAll() {
        return this.authorRepository.findAll();
    }

    @Override
    public Author findById(Long id) {
        if (Objects.equals(id, null)) throw new AuthorWithIdNotFound(id);

        return this.authorRepository.findById(id)
                .orElseThrow(() -> new AuthorWithIdNotFound(id));
    }
}
