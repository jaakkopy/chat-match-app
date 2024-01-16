// For manual testing purposes, this script attempts to register 100 random users to test database (test database if the environment variable is set)
// The number can be less due to the possibility of generating the same email more than once
import dotenv from "dotenv";
if (process.env.NODE_ENV == "test") {
    dotenv.config({path: '.env.test'});
} else {
    dotenv.config();
}
import authService from "./services/auth-service";
import getDB from "./db/db";
import { RegistrationFields } from "./models/auth-interfaces";

const s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

for (let i = 0; i < 100; ++i) {
    // copied from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    const randomEmail = Array(10).join().split(',').map(function() { return s.charAt(Math.floor(Math.random() * s.length)); }).join('') + "@email.com";
    const fields: RegistrationFields = {
        email: randomEmail,
        fullname: `First Last${i}`,
        birthdate: "1999-01-01",
        password: "password"
    }
    authService.register(fields, getDB());
}