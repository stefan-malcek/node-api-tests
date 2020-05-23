export interface BusinessError {
    name: string;
    description: string
}

export const InvalidGender: BusinessError = {name: 'INVALID_GENDER', description: "Gender doesn't exist."}
export const IsbnNotUnique: BusinessError = {name: 'ISBN_NOT_UNIQUE', description: 'ISBN already exists.'}