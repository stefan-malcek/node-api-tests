import jsonwebtoken from 'jsonwebtoken';
import {JWT_SECRET} from "../../config";

export interface Token {
    userId: number;
    role: string;
}

export class JwtManager {
    public createToken(userId: number, role: string): string {
        return jsonwebtoken.sign({userId, role}, JWT_SECRET, {
            expiresIn: 3600,
        });
    }

    public decodeToken(token: string): Token | null {
        try {
            return jsonwebtoken.verify(token, JWT_SECRET) as Token;
        } catch (error) {
            console.error(error);

            return null;
        }
    }
}

const manager = new JwtManager();
export default manager;
