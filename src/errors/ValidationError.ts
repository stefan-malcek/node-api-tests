import {BusinessError} from "./index";

export class ValidationError extends Error {
    public description: string;

    constructor(error: BusinessError) {
        super("Invalid body, check 'errors' property for more info.");
        this.name = error.name;
        this.description = error.description;
    }
}
