package com.example.libraryapp.service.impl;

import com.example.libraryapp.model.Author;
import com.example.libraryapp.model.Book;
import com.example.libraryapp.model.dto.BookDto;
import com.example.libraryapp.model.dto.ErrorDto;
import com.example.libraryapp.model.enumerations.BookCategory;
import com.example.libraryapp.model.exceptions.*;
import com.example.libraryapp.repository.BookRepository;
import com.example.libraryapp.service.AuthorService;
import com.example.libraryapp.service.BookService;
import jdk.jfr.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final AuthorService authorService;

    public BookServiceImpl(BookRepository bookRepository, AuthorService authorService) {
        this.bookRepository = bookRepository;
        this.authorService = authorService;
    }

    @Override
    public List<Book> findAll() {
        return this.bookRepository.findAll();
    }

    @Override
    public Page<Book> findAllWithPagination(Pageable pageable) {
        return this.bookRepository.findAll(pageable);
    }

    @Override
    public Book findById(Long id) {
        if (Objects.equals(id, null)) throw new BookWithIdNotFound(id);

        return this.bookRepository.findById(id)
                .orElseThrow(() -> new BookWithIdNotFound(id));
    }

    @Override
    public List<BookCategory> findCategories() {
        return Arrays.asList(BookCategory.values());
    }

    @Override
    public Book save(BookDto bookDto) {

        if (Objects.equals(bookDto.getName(), null) || Objects.equals(bookDto.getName(), "")) {
            throw new BookNameCannotBeEmpty();
        }


        Author author = null;
        try {
            author = this.authorService.findById(bookDto.getAuthorId());
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }


        BookCategory category = null;
        if (!Objects.equals(bookDto.getCategory(), null)) {
            try {
                category = BookCategory.valueOf(bookDto.getCategory().toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new BookCategoryNotInEnumeration();
            }
        }
        else {
            throw new BookCategoryNotInEnumeration();
        }

        if (bookDto.getAvailableCopies() < 0) {
            throw new AvailableCopiesCannotBeANegativeNumber();
        }

        if (bookDto.getCurrentlyTaken() < 0) {
            throw new CurrentlyTakenCopiesCannotBeANegativeNumber();
        }

        if (bookDto.getCurrentlyTaken() > bookDto.getAvailableCopies()) {
            throw new CurrentlyTakenCopiesCannotBeALargerNumberThanAvailableCopies();
        }


        return this.bookRepository.save(new Book(bookDto.getName(), category, author, bookDto.getAvailableCopies(), bookDto.getCurrentlyTaken()));

    }

    @Override
    public Book edit(Long id, BookDto bookDto) {

        Book book = this.findById(id);


        if (Objects.equals(bookDto.getName(), null) || Objects.equals(bookDto.getName(), "")) {
            throw new BookNameCannotBeEmpty();
        }


        Author author = null;
        try {
            author = this.authorService.findById(bookDto.getAuthorId());
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }


        BookCategory category = null;
        if (!Objects.equals(bookDto.getCategory(), null)) {
            try {
                category = BookCategory.valueOf(bookDto.getCategory().toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new BookCategoryNotInEnumeration();
            }
        }
        else {
            throw new BookCategoryNotInEnumeration();
        }


        book.setName(bookDto.getName());
        book.setAuthor(author);
        book.setCategory(category);
        book.setAvailableCopies(bookDto.getAvailableCopies());
        book.setCurrentlyTaken(bookDto.getCurrentlyTaken());
        this.bookRepository.save(book);

        return book;
    }

    @Override
    public void delete(Long id) {
        Book book = this.findById(id);

        this.bookRepository.delete(book);
    }

    @Override
    public Book increaseCurrentlyTaken(Long id) {
        Book book = this.findById(id);

        if (book.getCurrentlyTaken() + 1 <= book.getAvailableCopies()) {
            book.setCurrentlyTaken(book.getCurrentlyTaken()+1);
        } else {
            throw new AllAvailableBookCopiesHaveAlreadyBeenTaken(book.getAvailableCopies());
        }

        this.bookRepository.save(book);
        return book;
    }

    @Override
    public Book decreaseCurrentlyTaken(Long id) {
        Book book = this.findById(id);

        if (book.getCurrentlyTaken() - 1 >= 0) {
            book.setCurrentlyTaken(book.getCurrentlyTaken()-1);
        } else {
            throw new CannotHaveLessThanZeroTakenBookCopies();
        }

        this.bookRepository.save(book);
        return book;
    }
}
