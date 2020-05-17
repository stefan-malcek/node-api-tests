import {IsInt, IsString, ValidateNested} from "class-validator";
import {GenreDto} from "./GenreModel";

export class BookDto {
    @IsInt()
    public id: number;

    @IsString()
    public name: string;

    @IsString()
    public isbn: string;

    @ValidateNested()
    public genre: GenreDto;
}
