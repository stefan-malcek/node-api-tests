import {
    BadRequestError,
    ExpressErrorMiddlewareInterface,
    Middleware,
} from 'routing-controllers';
import {NotFoundError} from '../errors/NotFoundError';
import {ApiErrorResponse, ApiResponse} from '../Responses';
import {ValidationError} from "../errors/ValidationError";

@Middleware({type: 'after'})
export class ErrorHandlingMiddleware
    implements ExpressErrorMiddlewareInterface {
    public error(error: any, request: any, response: any) {
        let errResponse;

        switch (error.constructor) {
            case BadRequestError:
               const errors = error.errors
                    ? this.extractValidationErrors({ children: error.errors })
                    : [];
                errResponse = new ApiErrorResponse('VALIDATION_ERROR', errors);
                break;
            case ValidationError:
                errResponse = new ApiErrorResponse(error.name, [error.description]);
                break;
            case NotFoundError:
                errResponse = new ApiResponse();
                errResponse.statusCode = 404;
                break;
            default:
                errResponse = new ApiResponse();
                errResponse.statusCode = 500;
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
