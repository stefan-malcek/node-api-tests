import {BusinessError, ValdiationFailed} from "./index";

export class ValidationError extends Error {
    public description: string;

    constructor(error: BusinessError) {
        super(ValdiationFailed.description);
        this.name = error.name;
        this.description = error.description;
    }
}
