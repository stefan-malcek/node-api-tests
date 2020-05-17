import 'reflect-metadata';
import {  PORT } from './config';
import {run} from "./src/app";

console.log('Server is starting...');

run( app => {
    app.listen(PORT, () => {
        console.log(`API is running on url: http://localhost:${PORT}`);
    });
});
