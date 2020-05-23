import {defaultMetadataStorage} from 'class-transformer/storage';
import {getFromContainer, MetadataStorage} from 'class-validator';
import {validationMetadatasToSchemas} from 'class-validator-jsonschema';
import express from 'express';
import {Action, getMetadataArgsStorage, useExpressServer} from 'routing-controllers';
import {routingControllersToSpec} from 'routing-controllers-openapi';
import swaggerUiExpress from 'swagger-ui-express';
import {BookController} from './controllers/BookController';
import {GenreController} from './controllers/GenreController';
import {ErrorHandlingMiddleware} from "./middlewares/ErrorHandlingMiddleware";
import JwtManager from "./services/JwtManager";

const authorizationChecker = async (action: Action, roles: string[]) => {
    const { authorization } = action.request.headers;
    if (!authorization) {
        return false;
    }

    const jwtToken = authorization.replace('Bearer ', '');
    const token = JwtManager.decodeToken(jwtToken);
    if (!token) {
        return false;
    }

    // You should verify userId.

    if (!roles.length) {
        return true;
    }

   return roles.some(role => token.role === role);
};

export const run = async (callback: (app: any) => void) => {
    const application = express();

    application.get('/', (_req, res) => res.send('API works!'));

    // creates express app, registers all controller routes
    const routingControllersOptions = {
        authorizationChecker,
        controllers: [GenreController, BookController],
        middlewares: [ErrorHandlingMiddleware],
        routePrefix: '/api',
        classTransformer: true,
        defaultErrorHandler: false,
        cors: true,
    };
    useExpressServer(application, routingControllersOptions);

    const metadatas = (getFromContainer(MetadataStorage) as any)
        .validationMetadatas;

    const schemas = validationMetadatasToSchemas(metadatas, {
        classTransformerMetadataStorage: defaultMetadataStorage,
        refPointerPrefix: '#/components/schemas/',
    });

    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
        components: {
            schemas,
            securitySchemes: {
                bearerAuth: {
                    scheme: 'bearer',
                    type: 'http',
                },
            },
        },
        title: 'Book Shelf API',
        version: 'v1',
    });

    application.use('/swagger', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));

    // Init application here.

    callback(application);
};

export const dispose = async () => {
    // Clean resource here, e.g.: database connection
};
