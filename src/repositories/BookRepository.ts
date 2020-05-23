import {Genre} from "./GenreRepository";

export class Book {
    id: number;
    name: string;
    created: Date;
    lastModified?: Date;
    isbn: string;
    genre: Genre;
}

class BookRepository {
    private static idCounter = 1;
    private books: Book[] = [
        {
            id: 1,
            name: 'Incredible space ship',
            created: new Date(),
            isbn: '978-3-16-148410-0',
            genre: {id: 1, name: 'Science fiction'}
        },
    ];

    public getBooks() {
        return [...this.books];
    }

    public getBook(id: number) {
        return this.books.find(genre => genre.id === id);
    }

    public isIsbnUnique(isbn: string){
        return !this.books.some(book => book.isbn === isbn);
    }

    public createBook(book: Book) {
        BookRepository.idCounter++;
        book.id = BookRepository.idCounter;
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