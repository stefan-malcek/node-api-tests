import express from 'express';
import supertest from 'supertest';
import * as http from "http";
import mockdate from 'mockdate';
import {ADMIN_TOKEN, USER_TOKEN} from "../config";
import {toQueryString} from "../src/utils/http";
import {dispose} from "../src/app";

export const NOW = '2020-05-01T10:42:56.784Z'

export interface RequestOptions {
    subUrl?: string;
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

    public async callGetAll(queryParams: any = {}, options: RequestOptions = {}) {
        const request = supertest(this.application)
            .get(`${this.baseUrl}${options.subUrl || ''}?${toQueryString(queryParams)}`)
            .send();

        return this.setRequestHeaders(request, options);
    }

    public async callGetOne(
        id: number,
        queryParams: any = {},
        options: RequestOptions = {}
    ) {
        const request = supertest(this.application)
            .get(`${this.baseUrl}/${id}?${toQueryString(queryParams)}`)
            .send();

        return this.setRequestHeaders(request, options);
    }

    public async callPost(payload: any = {}, options: RequestOptions = {}) {
        const request = supertest(this.application)
            .post(`${this.baseUrl}${options.subUrl || ''}`)
            .send(payload);

        return this.setRequestHeaders(request, options);
    }

    public async callPut(
        id: number,
        payload: any = {},
        options: RequestOptions = {}
    ) {
        const request = supertest(this.application)
            .put(`${this.baseUrl}/${id}${options.subUrl || ''}`)
            .send(payload);

        return this.setRequestHeaders(request, options);
    }

    public async callDelete(id: number, options: RequestOptions = {}) {
        const request = supertest(this.application)
            .delete(`${this.baseUrl}/${id}${options.subUrl || ''}`)
            .send();

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