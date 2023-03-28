package com.example.libraryapp.service;

import com.example.libraryapp.model.Book;
import com.example.libraryapp.model.dto.BookDto;
import com.example.libraryapp.model.enumerations.BookCategory;
import jdk.jfr.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookService {
    public Book save(BookDto bookDto);
    public Book edit(Long id, BookDto bookDto);
    public List<Book> findAll();
    public Book findById(Long id);
    public List<BookCategory> findCategories();
    public void delete(Long id);
    public Book increaseCurrentlyTaken(Long id);
    public Book decreaseCurrentlyTaken(Long id);
    public Page<Book> findAllWithPagination(Pageable pageable);
}
