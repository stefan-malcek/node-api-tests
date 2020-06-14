import {Type} from 'class-transformer';
import {
    IsInt, IsNumber, IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import * as StatusCode from './StatusCode';
import {ValidationFailed} from "./errors";

export class ApiMetadata {
    @IsNumber()
    @IsOptional()
    public totalItems: number;

    @IsNumber()
    @IsOptional()
    public pageSize: number;

    @IsNumber()
    @IsOptional()
    public page: number;

    constructor(pageSize?: number, page?: number, totalItems?: number) {
        this.pageSize = pageSize;
        this.page = page;
        this.totalItems = totalItems;
    }
}

export class ApiResponse {
    @IsInt()
    public statusCode: number;

    @IsString()
    public message: string;

    @IsOptional()
    @ValidateNested()
    public metadata: ApiMetadata;

    constructor(statusCode: number = StatusCode.Ok, message: string = "Ok", metadata: ApiMetadata = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.metadata = metadata;
    }
}

export class ApiErrorResponse extends ApiResponse {
    @IsString()
    public name: string;

    @ValidateNested({each: true})
    @Type(() => String)
    public errors: string[];

    constructor(name: string, errors: string[]) {
        super(StatusCode.BadRequest, ValidationFailed.description);
        this.name = name;
        this.errors = errors;
    }
}
