import * as express from 'express';

export const run = async (callback: (app: any) => void) => {
    const application = express();

    application.get('/', (_req, res) => res.send('API works!'));

    // Init application here.

    callback(application);
};

export const dispose = async () => {
    // Clean resource here, e.g.: database connection
};
