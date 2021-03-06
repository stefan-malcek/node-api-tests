import {IsDate, IsDefined, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested} from 'class-validator';
import {GenreDto} from './GenreModel';
import {isString} from "util";

export class CreateBookCommand {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    public name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(17)
    public isbn: string;

    @IsInt()
    @IsDefined()
    public genreId: number;
}

export class UpdateBookCommand {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    public name: string;

    @IsInt()
    @IsDefined()
    public genreId: number;
}

export class BookDto {
    @IsInt()
    public id: number;

    @IsString()
    public name: string;

    @IsDate()
    public created: Date;

    @IsDate()
    @IsOptional()
    public lastModified: Date;

    @IsString()
    public isbn: string;

    @ValidateNested()
    public genre: GenreDto;

    @IsString()
    @IsOptional()
    public url?: string;
}

export class BookQuery {
    @IsInt()
    public page: number = 1;

    @IsInt()
    public pageSize: number = 3;

    @IsInt()
    @IsOptional()
    public genreId?: number;

    @IsString()
    @IsOptional()
    public search?: string;
}
