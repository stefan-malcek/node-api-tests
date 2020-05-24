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
            name: 'The mighty Hadodrak.',
            created: new Date('2020-02-28T14:45:21.464Z'),
            isbn: '978-3-16-148410-0',
            genre: {id: 1, name: 'Science fiction'}
        },
        {
            id: 2,
            name: 'Who took greek yogurt from the fridge?',
            created: new Date('2020-03-28T14:12:21.444Z'),
            isbn: '978-3-16-148410-1',
            genre: {id: 5, name: 'Detective'}
        },
        {
            id: 3,
            name: 'API testing nightmare.',
            created: new Date('2020-04-28T12:45:21.214Z'),
            isbn: '978-3-16-148410-2',
            genre: {id: 4, name: 'Horror'}
        },
        {
            id: 4,
            name: "I will never ever drink again.",
            created: new Date('2020-05-15T10:47:141.478Z'),
            isbn: '878-3-16-148410-2',
            genre: {id: 1, name: 'Science fiction'}
        },
    ];

    constructor() {
        console.log('ctor');
    }

    public getBooks(query: BookQuery) {
        let books = [...this.books];

        if (query.genreId) {
            books = books.filter(book => book.genre.id === query.genreId);
        }

        if (query.search) {
            books = books.filter(book => book.name.includes(query.search));
        }

        return [BookRepository.paginate(books, query), books.length];
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

    private static paginate(array, query: BookQuery) {
        return array.slice((query.page - 1) * query.pageSize, query.page * query.pageSize);
    }
}

let repository = new BookRepository();
export default repository;