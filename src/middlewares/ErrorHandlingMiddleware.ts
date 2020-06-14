import {
    BadRequestError,
    ExpressErrorMiddlewareInterface,
    Middleware,
} from 'routing-controllers';
import * as StatusCode from '../StatusCode';
import {AccessDeniedError} from "routing-controllers/error/AccessDeniedError";
import {ApiErrorResponse, ApiResponse} from "../Responses";
import {ValidationFailed} from "../errors";
import {ValidationError} from "../errors/ValidationError";
import {UnauthorizedError} from "../errors/UnathorizedError";
import {NotFoundError} from "../errors/NotFoundError";

@Middleware({type: 'after'})
export class ErrorHandlingMiddleware
    implements ExpressErrorMiddlewareInterface {
    public error(error: any, request: any, response: any) {
        let errResponse;

        switch (error.constructor) {
            case BadRequestError:
                const errors = error.errors
                    ? this.extractValidationErrors({children: error.errors})
                    : [];
                errResponse = new ApiErrorResponse(ValidationFailed.name, errors);
                break;
            case ValidationError:
                errResponse = new ApiErrorResponse(error.name, [error.description]);
                break;
            case UnauthorizedError:
                errResponse = new ApiResponse();
                errResponse.statusCode = StatusCode.Unauthorized;
                break;
            case AccessDeniedError:
                errResponse = new ApiResponse();
                errResponse.statusCode = StatusCode.Forbidden;
                break;
            case NotFoundError:
                errResponse = new ApiResponse();
                errResponse.statusCode = StatusCode.NotFound;
                break;
            default:
                errResponse = new ApiResponse();
                errResponse.statusCode = StatusCode.InternalError;
        }

        errResponse.message = error.message;

        response.status(errResponse.statusCode);
        response.send(errResponse);
    }

    private extractValidationErrors(error: any) {
        if (!error.children || error.children.length === 0) {
            return Object.values(error.constraints);
        }

        const errors = error.constraints ? Object.values(error.constraints) : [];

        // @ts-ignore
        return error.children.reduce((accum, err) => {
            return [...accum, ...this.extractValidationErrors(err)];
        }, errors);
    }
}
