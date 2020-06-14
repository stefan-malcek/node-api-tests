import {BusinessError, ValidationFailed} from "./index";

export class ValidationError extends Error {
    public description: string;

    constructor(error: BusinessError) {
        super(ValidationFailed.description);
        this.name = error.name;
        this.description = error.description;
    }
}
