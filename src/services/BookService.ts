import {BookDto, BookQuery, CreateBookCommand, UpdateBookCommand} from '../models/BookModel';
import BookRepository, {Book} from '../repositories/BookRepository';
import GenreRepository from '../repositories/GenreRepository';
import {NotFoundError} from '../errors/NotFoundError';
import {ValidationError} from "../errors/ValidationError";
import {InvalidGender, IsbnNotUnique} from "../errors";
import {mapIntoBook, toBook, toBookDto} from "../mappings/BookMapping";

export class BookService {
    private bookRepository = BookRepository;
    private genreRepository = GenreRepository;

    public getBooks(query: BookQuery): BookDto[] {
        return this.bookRepository.getBooks(query).map(toBookDto);
    }

    public getBook(id: number): BookDto {
        const book = this.bookRepository.getBook(id);
        if (!book) {
            throw new NotFoundError("Book", id);
        }

        return toBookDto(book);
    }

    public createBook(createBook: CreateBookCommand): BookDto {
        const genre = this.genreRepository.getGenre(createBook.genreId);
        if (!genre) {
            throw new ValidationError(InvalidGender);
        }

        const isIsbnUnique = this.bookRepository.isIsbnUnique(createBook.isbn);
        if (!isIsbnUnique) {
            throw new ValidationError(IsbnNotUnique);
        }

        let book = toBook(createBook);
        book.genre = genre;

        book = this.bookRepository.createBook(book);

        return toBookDto(book);
    }

    public updateBook(bookId: number, updateBook: UpdateBookCommand): BookDto {
        let book = this.bookRepository.getBook(bookId);
        if (!book) {
            throw new NotFoundError("Book", bookId);
        }

        const genre = this.genreRepository.getGenre(updateBook.genreId);
        if (!genre) {
            throw new ValidationError(InvalidGender);
        }

        mapIntoBook(updateBook, book);
        book.genre = genre;

        book = this.bookRepository.updateBook(book);

        return toBookDto(book);
    }

    public deleteBook(bookId: number): void {
        let book = this.bookRepository.getBook(bookId);
        if (!book) {
            throw new NotFoundError("Book", bookId);
        }

        this.bookRepository.deleteBook(bookId);
    }
}