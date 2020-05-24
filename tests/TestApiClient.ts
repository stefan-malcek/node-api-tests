import express from 'express';
import supertest from 'supertest';
import * as http from "http";
import mockdate from 'mockdate';
import {ADMIN_TOKEN, PORT, USER_TOKEN} from "../config";
import {run, dispose} from "../src/app";
import {toQueryString} from "../src/utils/http";

export const NOW = '2020-05-01T10:42:56.784Z'

export interface RequestOptions {
    subUrl?: string;
    queryParams?: any;
    data?: any;
    extraHeaders?: {
        [name: string]: string;
    };
}

export class TestApiClient {
    private application: express.Application;
    private server: http.Server;
    private jwtToken: string;

    constructor(private baseUrl: string) {
    }

    public setNow(date: Date | string | number) {
        mockdate.set(date);
    }

    public resetNow() {
        this.setNow(NOW);
    }

    public setToken(token: string) {
        this.jwtToken = token;
    }

    public setUserToken() {
        this.setToken(USER_TOKEN);
    }

    public setAdminToken() {
        this.setToken(ADMIN_TOKEN);
    }

    public clearToken() {
        this.setToken("");
    }

    public async runServer() {
        await run(async app => {
            this.application = app;
            this.server = app.listen(PORT);
        });
    }

    public async resetDatabase() {
        // You can run scripts to reset your data before running tests.
        // E.g.: when using typeorm, you can reset your db with typeorm-fixtures.
    }

    public async callGetMany(options: RequestOptions = {}) {
        const request = supertest(this.application)
            .get(`${this.baseUrl}${options.subUrl || ''}?${toQueryString(options.queryParams)}`)
            .send();

        return this.setRequestHeaders(request, options);
    }

    public async callGetOne(
        id: number,
        options: RequestOptions = {}
    ) {
        const request = supertest(this.application)
            .get(`${this.baseUrl}/${id}?${toQueryString(options.queryParams)}`)
            .send();

        return this.setRequestHeaders(request, options);
    }

    public async callPost(options: RequestOptions = {}) {
        const request = supertest(this.application)
            .post(`${this.baseUrl}${options.subUrl || ''}`)
            .send(options.data || {});

        return this.setRequestHeaders(request, options);
    }

    public async callPut(
        id: number,
        options: RequestOptions = {}
    ) {
        const request = supertest(this.application)
            .put(`${this.baseUrl}/${id}${options.subUrl || ''}`)
            .send(options.data || {});

        return this.setRequestHeaders(request, options);
    }

    public async callDelete(id: number, options: RequestOptions = {}) {
        const request = supertest(this.application)
            .delete(`${this.baseUrl}/${id}${options.subUrl || ''}`)
            .send(options.data || {});

        return this.setRequestHeaders(request, options);
    }

    /**
     * Cleanup resources here.
     */
    public async dispose() {
        if (this.server) {
            this.server.close();
        }

        await dispose();
        mockdate.reset();
    }

    private setRequestHeaders(request: any, options: RequestOptions) {
        let req = request;

        if (this.jwtToken) {
            req = request.set('Authorization', `Bearer ${this.jwtToken}`);
        }

        if (options.extraHeaders) {
            for (const [key, value] of Object.entries(options.extraHeaders)) {
                req = req.set(key, value);
            }
        }

        return req;
    }
}