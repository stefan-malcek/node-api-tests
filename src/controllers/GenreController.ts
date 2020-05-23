import {Type} from 'class-transformer';
import {ValidateNested} from 'class-validator';
import {JsonController, Param, Get, Authorized} from 'routing-controllers';
import {ResponseSchema} from 'routing-controllers-openapi';
import {ApiResponse} from '../Responses';
import {GenreDto} from '../models/GenreModel';
import {GenreService} from '../services/GenreService';

class GenresResponse extends ApiResponse {
    @ValidateNested({each: true})
    @Type(() => GenreDto)
    data: GenreDto[];
}

class GenreResponse extends ApiResponse {
    @ValidateNested()
    data: GenreDto;
}

@Authorized()
@JsonController('/genres')
export class GenreController {
    private service: GenreService;

    constructor() {
        this.service = new GenreService();
    }

    @Get()
    @ResponseSchema(GenresResponse)
    getAll() {
        const response = new GenresResponse();
        response.data = this.service.getGenres();
        return response;
    }

    @Get('/:id')
    @ResponseSchema(GenreResponse)
    getOne(@Param('id') id: number) {
        const response = new GenreResponse();
        response.data = this.service.getGenre(id);
        return response;
    }
}