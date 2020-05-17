import {JsonController, Param, Get} from "routing-controllers";
import {ApiResponse} from "../Responses";
import {GenreDto} from "../models/GenreModel";
import {ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {ResponseSchema} from "routing-controllers-openapi";

class GenresResponse extends ApiResponse {
    @ValidateNested({each: true})
    @Type(() => GenreDto)
    data: GenreDto[];
}

class GenreResponse extends ApiResponse {
    @ValidateNested()
    data: GenreDto;
}

@JsonController('/genres')
export class GenreController {
    @Get()
    @ResponseSchema(GenresResponse)
    getAll() {
        return new GenresResponse();
    }

    @Get("/:id")
    @ResponseSchema(GenreResponse)
    getOne(@Param("id") id: number) {
        return new GenreResponse();
    }
}