import {API_START_TIMEOUT} from '../constants';
import {TestApiClient} from '../TestApiClient';
import {InvalidGenre, IsbnNotUnique, ValidationFailed} from '../../src/errors';
import {generateString} from './utils';
import {bookQueryFactory, createBookFactory, mockedIsbnApiResponse, updateBookFactory} from './factories/bookFactory';
import {IsbnApiService} from '../../src/services/IsbnApiService';
import {
    expectBadRequest,
    expectForbidden,
    expectItemsCountOk,
    expectNotFound,
    expectSnapshotOk,
    expectUnauthorized
} from '../expects';

let client: TestApiClient;

const BASE_URL = '/api/books';
const QUERY_BOOK_ID = 3;
const EDIT_BOOK_ID = 4;
const DELETE_BOOK_ID = 2;
const INVALID_BOOK_ID = 565;

beforeAll(async done => {
    client = new TestApiClient(BASE_URL);
    client.resetNow();

    await client.runServer();
    done();
}, API_START_TIMEOUT);

describe(`API: ${BASE_URL}`, () => {
    /** **************************************************************************
     * GET MANY
     ************************************************************************** */
    test('GET MANY: SNAPSHOT OK', async (done) => {
        client.setUserToken();

        const response = await client.callGetMany();

        expectSnapshotOk(response);
        done();
    });

    [
        ['filter by genreId', bookQueryFactory({genreId: 1}), 2],
        ['filter by search', bookQueryFactory({search: 'Hadodrak'}), 1],
    ].forEach(([label, query, totalItems]) => {
        test(`GET MANY: ${label}`, async (done) => {
            client.setUserToken();

            const response = await client.callGetMany({queryParams: query});

            expectItemsCountOk(response, totalItems);
            done();
        });
    })

    test('GET MANY: UNAUTHORIZED', async (done) => {
        const response = await client.callGetMany();

        expectUnauthorized(response);
        done();
    });

    /** **************************************************************************
     * GET ONE
     ************************************************************************** */
    test('GET ONE: SNAPSHOT OK', async (done) => {
        client.setUserToken();

        const response = await client.callGetOne(QUERY_BOOK_ID);

        expectSnapshotOk(response);
        done();
    });

    test('GET ONE: UNAUTHORIZED', async (done) => {
        const response = await client.callGetOne(QUERY_BOOK_ID);

        expectUnauthorized(response);
        done();
    });

    test('GET ONE: NOT FOUND', async (done) => {
        client.setUserToken();

        const response = await client.callGetOne(INVALID_BOOK_ID);

        expectNotFound(response);
        done();
    });

    /** **************************************************************************
     * CREATE
     ************************************************************************** */
    test('CREATE: SNAPSHOT OK', async (done) => {
        jest.spyOn(IsbnApiService.prototype, 'getBookInfo')
            .mockImplementation(() => Promise.resolve(mockedIsbnApiResponse));
        client.setAdminToken();

        const response = await client.callPost({
            data: createBookFactory({isbn: '978-3-319-25557-7'})
        });

        expectSnapshotOk(response);
        done();
    });

    [
        ['name null', createBookFactory({name: null})],
        ['name too long', createBookFactory({name: generateString(51)})],
        ['isbn null', createBookFactory({isbn: null})],
        ['isbn too long', createBookFactory({isbn: generateString(18)})],
    ].forEach(([label, data]) => {
        test(`CREATE: BAD REQUEST, error: ${label}`, async (done) => {
            client.setAdminToken();

            const response = await client.callPost({data});

            expectBadRequest(response, ValidationFailed);
            done();
        });
    });

    test('CREATE: BAD REQUEST, error: isbn not unique', async (done) => {
        client.setAdminToken();
        const data = createBookFactory({isbn: '978-3-16-148410-0'})

        const response = await client.callPost({data});

        expectBadRequest(response, IsbnNotUnique);
        done();
    });

    test('CREATE: BAD REQUEST, error: invalid genre', async (done) => {
        client.setAdminToken();
        const data = createBookFactory({genreId: 4654})

        const response = await client.callPost({data});

        expectBadRequest(response, InvalidGenre);
        done();
    });

    test('CREATE: UNAUTHORIZED', async (done) => {
        const response = await client.callPost({data: createBookFactory()});

        expectUnauthorized(response);
        done();
    });

    test('CREATE: FORBIDDEN', async (done) => {
        client.setUserToken();

        const response = await client.callPost({data: createBookFactory()});

        expectForbidden(response);
        done();
    });

    /** **************************************************************************
     * UPDATE
     ************************************************************************** */
    test('UPDATE: SNAPSHOT OK', async (done) => {
        client.setAdminToken();

        const response = await client.callPut(EDIT_BOOK_ID, {data: updateBookFactory()});

        expectSnapshotOk(response);
        done();
    });

    [
        ['name null', createBookFactory({name: null})],
        ['name too long', createBookFactory({name: generateString(51)})]
    ].forEach(([label, data]) => {
        test(`UPDATE: BAD REQUEST, error: ${label}`, async (done) => {
            client.setAdminToken();

            const response = await client.callPut(EDIT_BOOK_ID, {data});

            expectBadRequest(response, ValidationFailed);
            done();
        });
    });

    test('UPDATE: BAD REQUEST, error: invalid genre', async (done) => {
        client.setAdminToken();
        const data = updateBookFactory({genreId: 4654})

        const response = await client.callPut(EDIT_BOOK_ID, {data});

        expectBadRequest(response, InvalidGenre);
        done();
    });

    test('UPDATE: UNAUTHORIZED', async (done) => {
        const response = await client.callPut(EDIT_BOOK_ID, {data: updateBookFactory()});

        expectUnauthorized(response);
        done();
    });

    test('UPDATE: FORBIDDEN', async (done) => {
        client.setUserToken();

        const response = await client.callPut(EDIT_BOOK_ID, {data: updateBookFactory()});

        expectForbidden(response);
        done();
    });

    test('UPDATE: NOT FOUND', async (done) => {
        client.setAdminToken();

        const response = await client.callPut(INVALID_BOOK_ID, {data: updateBookFactory()});

        expectNotFound(response);
        done();
    });

    /** **************************************************************************
     * DELETE
     ************************************************************************** */
    test('DELETE: SNAPSHOT OK', async (done) => {
        client.setAdminToken();

        const response = await client.callDelete(DELETE_BOOK_ID);

        expectSnapshotOk(response);
        done();
    });

    test('DELETE: UNAUTHORIZED', async (done) => {
        const response = await client.callDelete(DELETE_BOOK_ID);

        expectUnauthorized(response);
        done();
    });

    test('DELETE: FORBIDDEN', async (done) => {
        client.setUserToken();

        const response = await client.callDelete(DELETE_BOOK_ID);

        expectForbidden(response);
        done();
    });

    test('DELETE: NOT FOUND', async (done) => {
        client.setAdminToken();

        const response = await client.callDelete(INVALID_BOOK_ID);

        expectNotFound(response);
        done();
    });
});

afterEach(done => {
    jest.restoreAllMocks();
    client.clearToken();
    done();
});


afterAll(async done => {
    await client.dispose();
    done();
});
