import {IsInt, IsString} from 'class-validator';

export class GenreDto {
    @IsInt()
    public id: number;

    @IsString()
    public name: string;
}
