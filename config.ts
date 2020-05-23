import {config} from 'dotenv';

config();

export const PORT = parseInt(process.env.PORT, 10);

export const JWT_SECRET = process.env.JWT_SECRET;

export const USER_TOKEN = process.env.USER_TOKEN || 'no-token';
export const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'no-token';