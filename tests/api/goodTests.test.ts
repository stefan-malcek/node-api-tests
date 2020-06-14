import * as StatusCode from '../../src/StatusCode';
import {API_START_TIMEOUT} from '../constants';
import {TestApiClient} from '../TestApiClient';
import {InvalidGender, IsbnNotUnique, ValidationFailed} from '../../src/errors';
import {generateString} from './utils';
import {bookQueryFactory, createBookFactory, mockedIsbnApiResponse, updateBookFactory} from './factories/bookFactory';
import {IsbnApiService} from "../../src/services/IsbnApiService";

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
    test('GET MANY: SNAPSHOT OK', async () => {
        client.setUserToken();

        const response = await client.callGetMany();

        expect(response.body).toMatchSnapshot();
        expect(response.status).toBe(StatusCode.Ok);
    });

    [
        ['filter by genreId', bookQueryFactory({genreId: 1}), 2],
        ['filter by search', bookQueryFactory({search: 'Hadodrak'}), 1],
    ].forEach(([label, query, totalItems]) => {
        test(`GET MANY: ${label}`, async () => {
            client.setUserToken();

            const response = await client.callGetMany({queryParams: query});

            expect(response.body.metadata.totalItems).toEqual(totalItems);
        });
    })

    test('GET MANY: UNAUTHORIZED', async () => {
        const response = await client.callGetMany();

        expect(response.status).toBe(StatusCode.Unauthorized);
    });

    /** **************************************************************************
     * GET ONE
     ************************************************************************** */
    test('GET ONE: SNAPSHOT OK', async () => {
        client.setUserToken();

        const response = await client.callGetOne(QUERY_BOOK_ID);

        expect(response.body).toMatchSnapshot();
        expect(response.status).toBe(StatusCode.Ok);
    });

    test('GET ONE: UNAUTHORIZED', async () => {
        const response = await client.callGetOne(QUERY_BOOK_ID);

        expect(response.status).toBe(StatusCode.Unauthorized);
    });

    test('GET ONE: NOT FOUND', async () => {
        client.setUserToken();

        const response = await client.callGetOne(INVALID_BOOK_ID);

        expect(response.status).toBe(StatusCode.NotFound);
    });

    /** **************************************************************************
     * CREATE
     ************************************************************************** */
    test('CREATE: SNAPSHOT OK', async () => {
        jest.spyOn(IsbnApiService.prototype, 'getBookInfo')
            .mockImplementation(() => Promise.resolve(mockedIsbnApiResponse));
        client.setAdminToken();

        const response = await client.callPost({
            data: createBookFactory({isbn: '978-3-319-25557-7'})
        });

        expect(response.body).toMatchSnapshot();
        expect(response.status).toBe(StatusCode.Ok);
    });

    [
        ['name null', createBookFactory({name: null})],
        ['name too long', createBookFactory({name: generateString(51)})],
        ['isbn null', createBookFactory({isbn: null})],
        ['isbn too long', createBookFactory({isbn: generateString(18)})],
    ].forEach(([label, data]) => {
        test(`CREATE: BAD REQUEST, error: ${label}`, async () => {
            client.setAdminToken();

            const response = await client.callPost({data});

            expect(response.body.name).toEqual(ValidationFailed.name);
            expect(response.status).toBe(StatusCode.BadRequest);
        });
    });

    test('CREATE: BAD REQUEST, error: isbn not unique', async () => {
        client.setAdminToken();
        const data = createBookFactory({isbn: '978-3-16-148410-0'})

        const response = await client.callPost({data});

        expect(response.body.name).toEqual(IsbnNotUnique.name);
        expect(response.status).toBe(StatusCode.BadRequest);
    });

    test('CREATE: BAD REQUEST, error: invalid genre', async () => {
        client.setAdminToken();
        const data = createBookFactory({genreId: 4654})

        const response = await client.callPost({data});

        expect(response.body.name).toEqual(InvalidGender.name);
        expect(response.status).toBe(StatusCode.BadRequest);
    });

    test('CREATE: UNAUTHORIZED', async () => {
        const response = await client.callPost({data: createBookFactory()});

        expect(response.status).toBe(StatusCode.Unauthorized);
    });

    test('CREATE: FORBIDDEN', async () => {
        client.setUserToken();

        const response = await client.callPost({data: createBookFactory()});

        expect(response.status).toBe(StatusCode.Forbidden);
    });

    /** **************************************************************************
     * UPDATE
     ************************************************************************** */
    test('UPDATE: SNAPSHOT OK', async () => {
        client.setAdminToken();

        const response = await client.callPut(EDIT_BOOK_ID, {data: updateBookFactory()});

        expect(response.body).toMatchSnapshot();
        expect(response.status).toBe(StatusCode.Ok);
    });

    [
        ['name null', createBookFactory({name: null})],
        ['name too long', createBookFactory({name: generateString(51)})]
    ].forEach(([label, data]) => {
        test(`UPDATE: BAD REQUEST, error: ${label}`, async () => {
            client.setAdminToken();

            const response = await client.callPut(EDIT_BOOK_ID, {data});

            expect(response.body.name).toEqual(ValidationFailed.name);
            expect(response.status).toBe(StatusCode.BadRequest);
        });
    });

    test('UPDATE: BAD REQUEST, error: invalid genre', async () => {
        client.setAdminToken();
        const data = updateBookFactory({genreId: 4654})

        const response = await client.callPut(EDIT_BOOK_ID, {data});

        expect(response.body.name).toEqual(InvalidGender.name);
        expect(response.status).toBe(StatusCode.BadRequest);
    });

    test('UPDATE: UNAUTHORIZED', async () => {
        const response = await client.callPut(EDIT_BOOK_ID, {data: updateBookFactory()});

        expect(response.status).toBe(StatusCode.Unauthorized);
    });

    test('UPDATE: FORBIDDEN', async () => {
        client.setUserToken();

        const response = await client.callPut(EDIT_BOOK_ID, {data: updateBookFactory()});

        expect(response.status).toBe(StatusCode.Forbidden);
    });

    test('UPDATE: NOT FOUND', async () => {
        client.setAdminToken();

        const response = await client.callPut(INVALID_BOOK_ID, {data: updateBookFactory()});

        expect(response.status).toBe(StatusCode.NotFound);
    });

    /** **************************************************************************
     * DELETE
     ************************************************************************** */
    test('DELETE: SNAPSHOT OK', async () => {
        client.setAdminToken();

        const response = await client.callDelete(DELETE_BOOK_ID);

        expect(response.body).toMatchSnapshot();
        expect(response.status).toBe(StatusCode.Ok);
    });

    test('DELETE: UNAUTHORIZED', async () => {
        const response = await client.callDelete(DELETE_BOOK_ID);

        expect(response.status).toBe(StatusCode.Unauthorized);
    });

    test('DELETE: FORBIDDEN', async () => {
        client.setUserToken();

        const response = await client.callDelete(DELETE_BOOK_ID);

        expect(response.status).toBe(StatusCode.Forbidden);
    });

    test('DELETE: NOT FOUND', async () => {
        client.setAdminToken();

        const response = await client.callDelete(INVALID_BOOK_ID);

        expect(response.status).toBe(StatusCode.NotFound);
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
