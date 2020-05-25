import {BookDto, CreateBookCommand, UpdateBookCommand} from "../models/BookModel";
import {Book} from "../repositories/BookRepository";

export const toBook = (createBook: CreateBookCommand): Book => {
    const book = new Book();
    book.name = createBook.name;
    book.isbn = createBook.isbn;
    return book;
};

export const mapIntoBook = (updateBook: UpdateBookCommand, book: Book): void => {
    book.name = updateBook.name;
};

export const toBookDto = (book: Book): BookDto => {
    const bookDto = new BookDto();
    bookDto.id = book.id;
    bookDto.name = book.name;
    bookDto.isbn = book.isbn;
    bookDto.genre = book.genre;
    bookDto.created = book.created;
    bookDto.lastModified = book.lastModified;

    if (book.url) {
        bookDto.url = book.url;
    }

    return bookDto;
};