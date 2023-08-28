import { Page, request } from "@playwright/test";
import { EndPoints } from "../../../common/navigationEnum/EndPoints";

export enum StatusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    SERVER_ERROR = 500,
}

export class HttpRequests {

    constructor(public page: Page) {
        this.page = page;
    }


    async importQuizBE(request:T, token: any, quizData: any, expectedStatus: number) {
        let response = await request.get(`${process.env.BASE_URL}/import`, { headers: { authorization: `Bearer ${token}` }, data: JSON.parse(quizData) });
       
    }

}