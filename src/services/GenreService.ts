import {GenreDto} from '../models/GenreModel';
import GenreRepository from '../repositories/GenreRepository';
import {NotFoundError} from '../errors/NotFoundError';
import {toGenreDto} from "../mappings/GenreMapping";

export class GenreService {
    public getGenres(): GenreDto[] {
        return GenreRepository.getGenres().map(toGenreDto);
    }

    public getGenre(id: number): GenreDto {
        const genre = GenreRepository.getGenre(id);
        if (!genre) {
            throw new NotFoundError("Genre", id);
        }

        return toGenreDto(genre);
    }
}