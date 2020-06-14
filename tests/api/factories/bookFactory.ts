export const SCIENCE_FICTION_ID = 1

export const bookQueryFactory = ({
  genreId = undefined,
  search = undefined
} = {}) => {
    return {genreId, search, page: 1, pageSize: 3};
}

export const createBookFactory = ({
  name = "I'll do it tomorrow",
  isbn = '978-3-16-148410-5',
  genreId = SCIENCE_FICTION_ID
} = {}) => {
    return {name, isbn, genreId};
}

export const updateBookFactory = ({
  name = "Friday night",
  genreId = 4
} = {}) => {
    return {name, genreId};
}

export const mockedIsbnApiResponse = {uri: 'https://we.did.it'};