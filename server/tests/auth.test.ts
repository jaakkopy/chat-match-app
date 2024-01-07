import { describe } from 'node:test';
import request from 'supertest';
import app from '../app';
import {query} from '../db/pool';

beforeAll(async () => {
    await query("DELETE FROM users;");
    await query("DELETE FROM likes;");
    await query("DELETE FROM dislikes;");
});


describe("Register via POST request", () => {
    const dummyCredentials = {
        email: "test@test.com",
        password: "test"
    };

    it("Should return 200 ok if the email is ok, the password is not empty, and the email is not taken", async () => {
        // delete the user first

        const res = await request(app)
            .post("/api/auth/register")
            .send(dummyCredentials);
        expect(res.statusCode).toEqual(200);
    });
});
