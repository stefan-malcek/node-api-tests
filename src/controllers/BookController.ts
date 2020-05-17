import {JsonController, Param, Body, Get, Post, Put, Delete} from "routing-controllers";
import {ApiResponse} from "../Responses";
import {ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {BookDto} from "../models/BookModel";
import {ResponseSchema} from "routing-controllers-openapi";


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

    @Get("/:id")
    @ResponseSchema(BookResponse)
    getOne(@Param("id") id: number) {
        return new BookResponse();
    }
}