export interface BusinessError {
    name: string;
    description: string
}

export const ValidationFailed : BusinessError = {
    name: 'VALIDATION_FAILED',
    description: 'Validation failed, see \'errors\' for further details.'
}

export const InvalidCredentials: BusinessError = {
    name: 'INVALID_CREDENTIALS',
    description: 'Username or password is invalid.'
}

export const InvalidGenre: BusinessError = {name: 'INVALID_GENRE', description: "Genre doesn't exist."}
export const IsbnNotUnique: BusinessError = {name: 'ISBN_NOT_UNIQUE', description: 'ISBN already exists.'}