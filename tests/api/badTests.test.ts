import * as http from "http";
import {PORT} from "../../config";
import {dispose, run} from "../../src/app";
import supertest from "supertest";
import {API_START_TIMEOUT} from "../constants";

let application;
let server: http.Server;
let jwtToken: string;

const PATH = '/api/books';
const QUERY_BOOK_ID = 3;
const EDIT_BOOK_ID = 1;
const DELETE_BOOK_ID = 2;

beforeAll(async done => {
    run(async app => {
        application = app;
        server = app.listen(PORT);

        const loginData = {
            username: "admin",
            password: "pass",
        };

        const result = await supertest(application)
            .post('/api/auth/login')
            .send(loginData);

        const responseData = JSON.parse(result.text);
        jwtToken = responseData.data.token;
        done();
    });
    // tslint:disable-next-line:align
}, API_START_TIMEOUT);

const booksResponse = [
    {
        "id": 1,
        "name": "The mighty Hadodrak.",
        "isbn": "978-3-16-148410-0",
        "genre": {
            "id": 1,
            "name": "Science fiction"
        },
    },
    {
        "id": 2,
        "name": "Who took greek yogurt from the fridge?",
        "isbn": "978-3-16-148410-1",
        "genre": {
            "id": 5,
            "name": "Detective"
        },
    },
    {
        "id": 3,
        "name": "API testing nightmare.",
        "isbn": "978-3-16-148410-2",
        "genre": {
            "id": 4,
            "name": "Horror"
        },
    }
]

describe('API: books', () => {
    test(`GET: ${PATH}`, async done => {
        const result = await supertest(application)
            .get(PATH)
            .send()
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(result.status).toBe(200);

        const responseData = JSON.parse(result.text);
        const parsedResponseData = responseData.data.map(item => {
            delete item.created;
            delete item.lastModified;
            return item;
        });
        expect(parsedResponseData).toEqual(booksResponse);

        done();
    });

    test(`GET: ${PATH}?search=${booksResponse[0].name}`, async done => {
        const result = await supertest(application)
            .get(`${PATH}?search=${booksResponse[0].name}`)
            .send()
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(result.status).toBe(200);

        const responseData = JSON.parse(result.text);
        const parsedResponseData = responseData.data.map(item => {
            delete item.created;
            delete item.lastModified;
            return item;
        });
        expect(parsedResponseData).toEqual(booksResponse.filter(item => item.name === booksResponse[0].name));

        done();
    });

    /****************************************************************************
     * GET ONE
     ***************************************************************************/
    test(`GET: ${PATH}/${QUERY_BOOK_ID}`, async done => {
        const result = await supertest(application)
            .get(`${PATH}/${QUERY_BOOK_ID}`)
            .send()
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(result.status).toBe(200);

        const responseData = JSON.parse(result.text);

        delete responseData.data.created;
        delete responseData.data.lastModified;

        expect(responseData.data).toEqual(booksResponse[2]);

        done();
    });

    /****************************************************************************
     * POST
     ***************************************************************************/
    test(`POST: ${PATH}`, async done => {
        const genreId = 1;
        const newBook = {
            genreId,
            name: "Book 1",
            isbn: '978-3-16-148410-8',
        }

        const result = await supertest(application)
            .post(PATH)
            .send(newBook)
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(result.status).toBe(200);

        const responseData = JSON.parse(result.text);
        delete responseData.data.id;
        delete responseData.data.created;
        delete responseData.data.genre.name;

        delete newBook.genreId;

        expect(responseData.data).toEqual({...newBook, genre: {id: genreId}});

        done();
    });

    /****************************************************************************
     * PUT
     ***************************************************************************/
    test(`PUT: ${PATH}/${EDIT_BOOK_ID}`, async done => {
        const genreId = 1;
        const updatedBook = {
            genreId,
            name: "Updated Book",
        }

        const result = await supertest(application)
            .put(`${PATH}/${EDIT_BOOK_ID}`)
            .send(updatedBook)
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(result.status).toBe(200);

        const responseData = JSON.parse(result.text);
        delete responseData.data.created;
        delete responseData.data.lastModified;
        delete responseData.data.isbn;
        delete responseData.data.genre.name;

        delete updatedBook.genreId;

        expect(responseData.data).toEqual({
            id: EDIT_BOOK_ID,
            ...updatedBook,
            genre: {id: genreId}
        });

        done();
    });

    test(`PUT: ${PATH}/{invalidId} - test not fount`, async done => {
        const updatedBook = {
            genreId : 2,
            name: "Updated Book",
        }

        const result = await supertest(application)
            .put(`${PATH}/454`)
            .send(updatedBook)
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(result.status).toBe(404);

        done();
    });

    /****************************************************************************
     * DELETE
     ***************************************************************************/
    test(`DELETE: ${PATH}/${DELETE_BOOK_ID}`, async done => {
        const deleteBookResult = await supertest(application)
            .delete(`${PATH}/${DELETE_BOOK_ID}`)
            .send()
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(deleteBookResult.status).toBe(200);

        done();
    });

    test(`DELETE: ${DELETE_BOOK_ID}/{invalidId} - test not fount`, async done => {
        const result = await supertest(application)
            .delete(`${PATH}/454`)
            .send()
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(result.status).toBe(404);

        done();
    });
});

afterAll(async done => {
    server.close();
    await dispose();
    done();
});
