import {Type} from 'class-transformer';
import {ValidateNested} from 'class-validator';
import {
    JsonController,
    Param,
    Get,
    Body,
    Post,
    Put,
    Delete,
    QueryParams,
    Authorized
} from 'routing-controllers';
import {OpenAPI, ResponseSchema} from 'routing-controllers-openapi';
import {ApiMetadata, ApiResponse} from '../Responses';
import {BookDto, BookQuery, CreateBookCommand, UpdateBookCommand} from '../models/BookModel';
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

@Authorized()
@OpenAPI({
    security: [{bearerAuth: []}],
})
@JsonController('/books')
export class BookController {
    private service: BookService;

    constructor() {
        this.service = new BookService();
    }

    @Get()
    @ResponseSchema(BooksResponse)
    getAll(@QueryParams()query: BookQuery) {
        const [books, totalItems] = this.service.getBooks(query);
        const response = new BooksResponse();
        response.data = books;
        response.metadata = new ApiMetadata(query.pageSize, query.page, totalItems);
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
    @Authorized('ADMIN')
    @ResponseSchema(BookResponse)
    create(@Body() createBook: CreateBookCommand) {
        const response = new BookResponse();
        response.data = this.service.createBook(createBook);
        return response;
    }

    @Put('/:id')
    @Authorized('ADMIN')
    @ResponseSchema(BookResponse)
    update(@Param('id') id: number, @Body() updateBook: UpdateBookCommand) {
        const response = new BookResponse();
        response.data = this.service.updateBook(id, updateBook);
        return response;
    }

    @Delete('/:id')
    @Authorized('ADMIN')
    @ResponseSchema(BookResponse)
    delete(@Param('id') id: number) {
        this.service.deleteBook(id);
        return new ApiResponse();
    }
}