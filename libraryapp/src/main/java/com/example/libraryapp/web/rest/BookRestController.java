package com.example.libraryapp.web.rest;

import com.example.libraryapp.model.Book;
import com.example.libraryapp.model.dto.BookDto;
import com.example.libraryapp.model.dto.ErrorDto;
import com.example.libraryapp.model.dto.SuccessDto;
import com.example.libraryapp.service.BookService;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Array;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookRestController {
    private final BookService bookService;

    public BookRestController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public ResponseEntity<List<Book>> getBooks() {
        return ResponseEntity.ok().body(this.bookService.findAll());
    }

    @GetMapping("/pagination")
    private List<Book> findALlWithPagination(Pageable pageable){
        return this.bookService.findAllWithPagination(pageable).getContent();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBook(@PathVariable Long id) {
        Book book = null;
        try {
            book = this.bookService.findById(id);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorDto(e.getMessage()));
        }

        return ResponseEntity.ok().body(book);
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        return ResponseEntity.ok().body(this.bookService.findCategories());
    }


    @PostMapping
    public ResponseEntity<?> addBook(@RequestBody BookDto bookDto) {
        Book newBook = null;
        try {
            newBook = this.bookService.save(bookDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorDto(e.getMessage()));
        }

        return ResponseEntity.ok().body(newBook);
    }

    @PostMapping("/{id}/edit")
    public ResponseEntity<?> editBook(@PathVariable Long id, @RequestBody BookDto bookDto) {
        Book editedBook = null;
        try {
            editedBook = this.bookService.edit(id, bookDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorDto(e.getMessage()));
        }

        return ResponseEntity.ok().body(editedBook);
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        try {
            this.bookService.delete(id);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorDto(e.getMessage()));
        }

        return ResponseEntity.ok().body(new SuccessDto(String.format("Successfully deleted book with 'id' %s", id)));
    }

    @PostMapping("/{id}/currentlyTaken/increase")
    public ResponseEntity<?> increaseCurrentlyTaken(@PathVariable Long id) {
        Book book = null;
        try {
            book = this.bookService.increaseCurrentlyTaken(id);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorDto(e.getMessage()));
        }

        return ResponseEntity.ok().body(book);
    }

    @PostMapping("/{id}/currentlyTaken/decrease")
    public ResponseEntity<?> decreaseCurrentlyTaken(@PathVariable Long id) {
        Book book = null;
        try {
            book = this.bookService.decreaseCurrentlyTaken(id);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorDto(e.getMessage()));
        }

        return ResponseEntity.ok().body(book);
    }
}
