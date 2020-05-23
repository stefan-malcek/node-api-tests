import {config} from 'dotenv';

config();

export const PORT = parseInt(process.env.PORT, 10);

export const JWT_SECRET = process.env.JWT_SECRET;
