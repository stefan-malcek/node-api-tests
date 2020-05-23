import {GenreDto} from "../models/GenreModel";
import {Genre} from "../repositories/GenreRepository";

export const toGenreDto = (genre: Genre): GenreDto => {
    const genreDto = new GenreDto();
    genreDto.id = genre.id;
    genreDto.name = genre.name;
    return genreDto;
};