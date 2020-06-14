import {BookDto, BookQuery, CreateBookCommand, UpdateBookCommand} from '../models/BookModel';
import BookRepository, {Book} from '../repositories/BookRepository';
import GenreRepository from '../repositories/GenreRepository';
import {NotFoundError} from '../errors/NotFoundError';
import {ValidationError} from "../errors/ValidationError";
import {InvalidGenre, IsbnNotUnique} from "../errors";
import {mapIntoBook, toBook, toBookDto} from "../mappings/BookMapping";
import {IsbnApiService} from "./IsbnApiService";

export class BookService {
    private bookRepository = BookRepository;
    private genreRepository = GenreRepository;
    private isbnApiService: IsbnApiService;

    constructor() {
        this.isbnApiService = new IsbnApiService();
    }

    public getBooks(query: BookQuery): [BookDto[], number] {
        const [books, totalItems] = this.bookRepository.getBooks(query);
        return [books.map(toBookDto), totalItems];
    }

    public getBook(id: number): BookDto {
        const book = this.bookRepository.getBook(id);
        if (!book) {
            throw new NotFoundError("Book", id);
        }

        return toBookDto(book);
    }

    public async createBook(createBook: CreateBookCommand): Promise<BookDto> {
        const genre = this.genreRepository.getGenre(createBook.genreId);
        if (!genre) {
            throw new ValidationError(InvalidGenre);
        }

        const isIsbnUnique = this.bookRepository.isIsbnUnique(createBook.isbn);
        if (!isIsbnUnique) {
            throw new ValidationError(IsbnNotUnique);
        }

        let book = toBook(createBook);

        const bookInfo = await this.isbnApiService.getBookInfo(createBook.isbn);
        if (bookInfo) {
            book.url = bookInfo.uri;
        }

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
            throw new ValidationError(InvalidGenre);
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