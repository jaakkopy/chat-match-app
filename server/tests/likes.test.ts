import request from 'supertest';
import app from '../app';
import {query} from '../db/pool';
import getDB from '../db/db';

const dummyCredentials1 = {
    email: "test1@test1.com",
    password: "test1"
};

const dummyCredentials2 = {
    email: "test2@test2.com",
    password: "test2"
};

beforeAll(async () => {
    await query("DELETE FROM users;");
    await query("DELETE FROM likes;");
    await query("DELETE FROM dislikes;");

    await request(app)
        .post("/api/auth/register")
        .send(dummyCredentials1);
    
    await request(app)
        .post("/api/auth/register")
        .send(dummyCredentials2);
});


afterEach(async () => {
    await query("DELETE FROM likes;");
    await query("DELETE FROM dislikes;");
});


describe("Liking another user via POST request", () => {
    it("Should return 401 without a valid JWT", async () => {
        const target = {email: dummyCredentials2.email};
        const res = await request(app)
            .post("/api/likes/like")
            .set("Authorization", "Bearer wrong")
            .send(target);
        expect(res.statusCode).toEqual(401);
    });

    it("Should return 200, and the like should exist if the target user is not already liked, and the JWT is valid", async () => {
        const target = {email: dummyCredentials2.email};
        const res1 = await request(app)
            .post("/api/auth/login")
            .send(dummyCredentials1);

        const jwt = res1.body.token;

        const res2 = await request(app)
            .post("/api/likes/like")
            .set("Authorization", "Bearer " + jwt)
            .send(target);
        
        expect(res2.statusCode).toEqual(200);
        const likes = await getDB().likes.getLikedUsersOfUser(dummyCredentials1.email);
        expect(likes.length).toEqual(1);
        expect(likes[0].email).toEqual(dummyCredentials2.email);
    });

    it("Should return 400 if the JWT is valid, but the target user does not exist", async () => {
        const target = {email: "nonexistent@email.com"};
        const res1 = await request(app)
            .post("/api/auth/login")
            .send(dummyCredentials1);

        const jwt = res1.body.token;

        const res2 = await request(app)
            .post("/api/likes/like")
            .set("Authorization", "Bearer " + jwt)
            .send(target);
       
        expect(res2.statusCode).toEqual(400);
    });

    it("If the target was previously disliked, the new like should replace the dislike", async () => {
        const target = {email: dummyCredentials2.email};
        const res1 = await request(app)
            .post("/api/auth/login")
            .send(dummyCredentials1);

        const jwt = res1.body.token;

        await request(app)
            .post("/api/likes/dislike")
            .set("Authorization", "Bearer " + jwt)
            .send(target);
        
        await request(app)
            .post("/api/likes/like")
            .set("Authorization", "Bearer " + jwt)
            .send(target); 

        // there should be no dislike
        const dislikes = await getDB().likes.getDislikedUsersOfUser(dummyCredentials1.email);
        expect(dislikes.length).toEqual(0);
        const likes = await getDB().likes.getLikedUsersOfUser(dummyCredentials1.email);
        // there should be one like with the correct target email
        expect(likes.length).toEqual(1);
        expect(likes[0].email).toEqual(dummyCredentials2.email);
    });
});


describe("Disliking another user via POST request", () => {
    it("Should return 401 without a valid JWT", async () => {
        const target = {email: dummyCredentials2.email};
        const res = await request(app)
            .post("/api/likes/dislike")
            .set("Authorization", "Bearer wrong")
            .send(target);
        expect(res.statusCode).toEqual(401);
    });

    it("Should return 200, and the dislike should exist if the target user is not already disliked, and the JWT is valid", async () => {
        const target = {email: dummyCredentials2.email};
        const res1 = await request(app)
            .post("/api/auth/login")
            .send(dummyCredentials1);

        const jwt = res1.body.token;

        const res2 = await request(app)
            .post("/api/likes/dislike")
            .set("Authorization", "Bearer " + jwt)
            .send(target);
        
        expect(res2.statusCode).toEqual(200);
        const dislikes = await getDB().likes.getDislikedUsersOfUser(dummyCredentials1.email);
        expect(dislikes.length).toEqual(1);
        expect(dislikes[0].email).toEqual(dummyCredentials2.email);
    });

    it("Should return 400 if the JWT is valid, but the target user does not exist", async () => {
        const target = {email: "nonexistent@email.com"};
        const res1 = await request(app)
            .post("/api/auth/login")
            .send(dummyCredentials1);

        const jwt = res1.body.token;

        const res2 = await request(app)
            .post("/api/likes/dislike")
            .set("Authorization", "Bearer " + jwt)
            .send(target);
       
        expect(res2.statusCode).toEqual(400);
    });

    it("If the target was previously liked, the new dislike should replace the like", async () => {
        const target = {email: dummyCredentials2.email};
        const res1 = await request(app)
            .post("/api/auth/login")
            .send(dummyCredentials1);

        const jwt = res1.body.token;

        await request(app)
            .post("/api/likes/like")
            .set("Authorization", "Bearer " + jwt)
            .send(target);
        
        await request(app)
            .post("/api/likes/dislike")
            .set("Authorization", "Bearer " + jwt)
            .send(target); 

        // there should be no like
        const likes = await getDB().likes.getLikedUsersOfUser(dummyCredentials1.email);
        expect(likes.length).toEqual(0);
        const dislikes = await getDB().likes.getDislikedUsersOfUser(dummyCredentials1.email);
        // there should be one dislike with the correct target email
        expect(dislikes.length).toEqual(1);
        expect(dislikes[0].email).toEqual(dummyCredentials2.email);
    });
});





