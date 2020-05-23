import {LoginCommand, UserDto, UserProfileDto} from "../models/AuthModel";
import {ValidationError} from "../errors/ValidationError";
import {InvalidCredentials} from "../errors";
import JwtManager from "./JwtManager";

const users = [
    {id: 1, username: 'user', role: 'USER'},
    {id: 2, username: 'admin', role: 'ADMIN'}
];

export class AuthService {
    public login(login: LoginCommand): UserProfileDto {
        const user = users.find(user => user.username === login.username);
        if (!user) {
            throw new ValidationError(InvalidCredentials);
        }

        // Omit password verification.

        const profile = new UserProfileDto();

        const userDto = new UserDto();
        userDto.id = user.id;
        userDto.username = user.username;
        profile.user = user;

        const token = JwtManager.createToken(user.id, user.role);
        profile.token = token;

        return profile;
    }
}
