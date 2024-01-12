import request from 'supertest';
import app from '../app';
import {query} from '../db/pool';

beforeAll(async () => {
    await query("DELETE FROM users;");
});

const dummyCredentials = {
    email: "test@test.com",
    password: "test",
    fullname: "Test 1",
    birthdate: "2000-01-01"
};

describe("Register via POST request", () => {
    it("Should return 400 if the user is not at least 18 years old", async () => {
        let notOk = {...dummyCredentials};
        const d = new Date();
        notOk.birthdate = `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${ ("0" + d.getDay()).slice(-2) }`;
        const res = await request(app)
            .post("/api/auth/register")
            .send(notOk);
        expect(res.statusCode).toEqual(400);
    });

    it("Should return 400 if the email is not valid", async () => {
        let notValid = {...dummyCredentials};
        notValid.email = "x";
        const res = await request(app)
            .post("/api/auth/register")
            .send(notValid);
        expect(res.statusCode).toEqual(400);
    });

    it("Should return 400 if the password is empty", async () => {
        let notValid = {...dummyCredentials};
        notValid.password = "";
        const res = await request(app)
            .post("/api/auth/register")
            .send(notValid);
        expect(res.statusCode).toEqual(400);
    });

    it("Should return 200 ok if the email is ok, the password is not empty, and the email is not taken", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send(dummyCredentials);
        expect(res.statusCode).toEqual(200);
    });

    it("Should return 400 if the email is already taken", async () => {
        await request(app)
            .post("/api/auth/register")
            .send(dummyCredentials);

        const res = await request(app)
            .post("/api/auth/register")
            .send(dummyCredentials);
        expect(res.statusCode).toEqual(400);
    });
});


describe("Login via POST request", () => {
    it("Should return 400 if the password is wrong", async () => {
        // create the test user again just in case
        await query("DELETE FROM users;");
        await request(app)
            .post("/api/auth/register")
            .send(dummyCredentials);

        let incorrect = {...dummyCredentials};
        incorrect.password = "wrong";
        const res = await request(app)
            .post("/api/auth/login")
            .send(incorrect);
        expect(res.statusCode).toEqual(400);
    });

    it("Should return 400 if the email is wrong", async () => {
        let incorrect = {...dummyCredentials};
        incorrect.email = "wrong";
        const res = await request(app)
            .post("/api/auth/login")
            .send(incorrect);
        expect(res.statusCode).toEqual(400);
    });

    it("Should return 200 and the JWT if the credentials are correct", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send(dummyCredentials);
        expect(res.statusCode).toEqual(200);
        expect(res.body.token).not.toBeUndefined();
        expect(res.body.token).not.toBe('');
    });
});
