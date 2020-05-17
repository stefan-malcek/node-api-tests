import {
    BadRequestError,
    ExpressErrorMiddlewareInterface,
    Middleware,
} from 'routing-controllers';
import {NotFoundError} from '../errors/NotFoundError';
import {ApiErrorResponse, ApiResponse} from '../Responses';

@Middleware({type: 'after'})
export class ErrorHandlingMiddleware
    implements ExpressErrorMiddlewareInterface {
    public error(error: any, request: any, response: any) {
        let errResponse;

        switch (error.constructor) {
            case BadRequestError:
                const errors = error.errors
                    // @ts-ignore
                    ? error.errors.reduce((errors: string[], {constraints}) => {
                        return errors.concat(Object.values(constraints));
                    }, [])
                    : [];
                errResponse = new ApiErrorResponse('VALIDATION_ERROR', errors);
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
}
