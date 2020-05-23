import {Type} from 'class-transformer';
import {ValidateNested} from 'class-validator';
import {JsonController, Param, Get, Body, Post, Put, Delete} from 'routing-controllers';
import {ResponseSchema} from 'routing-controllers-openapi';
import {ApiResponse} from '../Responses';
import {BookDto, CreateBookCommand, UpdateBookCommand} from '../models/BookModel';
import {BookService} from "../services/BookService";

class BooksResponse extends ApiResponse {
    @ValidateNested({each: true})
    @Type(() => BookDto)
    data: BookDto[];
}

class BookResponse extends ApiResponse {
    @ValidateNested()
    data: BookDto;
}

@JsonController('/books')
export class BookController {
    private service: BookService;

    constructor() {
        this.service = new BookService();
    }

    @Get()
    @ResponseSchema(BooksResponse)
    getAll() {
        const response = new BooksResponse();
        response.data = this.service.getBooks();
        return response;
    }

    @Get('/:id')
    @ResponseSchema(BookResponse)
    getOne(@Param('id') id: number) {
        const response = new BookResponse();
        response.data = this.service.getBook(id);
        return response;
    }

    @Post()
    @ResponseSchema(BookResponse)
    create(@Body() createBook: CreateBookCommand) {
        const response = new BookResponse();
        response.data = this.service.createBook(createBook);
        return response;
    }

    @Put('/:id')
    @ResponseSchema(BookResponse)
    update(@Param('id') id: number, @Body() updateBook: UpdateBookCommand) {
        const response = new BookResponse();
        response.data = this.service.updateBook(id, updateBook);
        return response;
    }

    @Delete('/:id')
    @ResponseSchema(BookResponse)
    delete(@Param('id') id: number) {
        this.service.deleteBook(id);
        return new ApiResponse();
    }
}