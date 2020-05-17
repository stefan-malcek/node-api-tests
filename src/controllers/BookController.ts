import {Type} from 'class-transformer';
import {ValidateNested} from 'class-validator';
import {JsonController, Param, Get} from 'routing-controllers';
import {ResponseSchema} from 'routing-controllers-openapi';
import {ApiResponse} from '../Responses';
import {BookDto} from '../models/BookModel';

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
    @Get()
    @ResponseSchema(BooksResponse)
    getAll() {
        return new BooksResponse();
    }

    @Get('/:id')
    @ResponseSchema(BookResponse)
    getOne(@Param('id') id: number) {
        return new BookResponse();
    }
}