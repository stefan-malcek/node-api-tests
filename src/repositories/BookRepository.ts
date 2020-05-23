import {Genre} from "./GenreRepository";
import {BookQuery} from "../models/BookModel";

// Extract to entities folder.
export class Book {
    id: number;
    name: string;
    created: Date;
    lastModified?: Date;
    isbn: string;
    genre: Genre;
}

class BookRepository {
    private idCounter = 1;
    private books: Book[] = [
        {
            id: 1,
            name: 'Incredible space ship',
            created: new Date(),
            isbn: '978-3-16-148410-0',
            genre: {id: 1, name: 'Science fiction'}
        },
    ];

    public getBooks(query: BookQuery) {
        // Omit pagination.

        if (query.genreId) {
            return this.books.filter(book => book.genre.id === query.genreId);
        }

        return [...this.books];
    }

    public getBook(id: number) {
        return this.books.find(book => book.id === id);
    }

    public isIsbnUnique(isbn: string) {
        return !this.books.some(book => book.isbn === isbn);
    }

    public createBook(book: Book) {
        this.idCounter++;

        book.id = this.idCounter;
        book.created = new Date();

        this.books.push({...book});
        return book;
    }

    public updateBook(book: Book) {
        book.lastModified = new Date();
        return book;
    }

    public deleteBook(id: number) {
        const index = this.books.findIndex(book => book.id === id);
        this.books.splice(index, 1);
    }
}

let repository = new BookRepository();
export default repository;