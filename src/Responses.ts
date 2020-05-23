import {Type} from 'class-transformer';
import {
    IsInt,
    IsString,
    ValidateNested,
} from 'class-validator';
import * as StatusCode from './StatusCode';

export class ApiResponse {
    @IsInt()
    public statusCode: number;

    @IsString()
    public message: string;

    constructor(statusCode: number = StatusCode.Ok, message: string = "Ok") {
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
        super(StatusCode.BadRequest, 'Validation failed, see \'errors\' for further details.');
        this.name = name;
        this.errors = errors;
    }
}
