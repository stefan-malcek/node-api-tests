import {Type} from 'class-transformer';
import {
    IsInt,
    IsString,
    ValidateNested,
} from 'class-validator';

export class ApiResponse {
    @IsInt()
    public statusCode: number;

    @IsString()
    public message: string;

    constructor(statusCode: number = 200, message: string = "Ok") {
        this.statusCode = statusCode;
        this.message = message;
    }
}

export class ApiErrorResponse extends ApiResponse {
    @IsString()
    public name: string;

    @ValidateNested({each: true})
    @Type(() => String)
    public errors: string[];

    constructor(name: string, errors: string[]) {
        super(400, 'Validation failed, see \'errors\' for further details.');
        this.name = name;
        this.errors = errors;
    }
}
