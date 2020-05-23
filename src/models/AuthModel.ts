import {IsInt, IsNotEmpty, IsString, ValidateNested} from 'class-validator';

export class LoginCommand {
    @IsString()
    @IsNotEmpty()
    public username: string;

    @IsString()
    @IsNotEmpty()
    public password: string;
}

export class UserDto {
    @IsInt()
    public id: number;

    @IsString()
    public username: string;
}

export class UserProfileDto {
    @ValidateNested()
    public user: UserDto;

    @IsString()
    public token: string;
}
