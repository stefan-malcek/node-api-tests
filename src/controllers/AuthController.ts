import {ValidateNested} from 'class-validator';
import {JsonController, Post, Body} from 'routing-controllers';
import {ResponseSchema} from 'routing-controllers-openapi';
import {ApiResponse} from '../Responses';
import {LoginCommand} from '../models/AuthModel';
import {AuthService} from '../services/AuthService';
import {UserProfileDto} from "../models/AuthModel";

class UserProfileResponse extends ApiResponse {
    @ValidateNested()
    data: UserProfileDto;
}

@JsonController('/auth')
export class AuthController {
    private service: AuthService;

    constructor() {
        this.service = new AuthService();
    }

    @Post('/login')
    @ResponseSchema(UserProfileResponse)
    async login(@Body() login: LoginCommand) {
        const response = new UserProfileResponse();
        response.data = await this.service.login(login);
        return response;
    }
}