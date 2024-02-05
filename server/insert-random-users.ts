import dotenv from "dotenv";
if (process.env.NODE_ENV == "test") {
    dotenv.config({path: '.env.test'});
} else {
    dotenv.config();
}
import authService from "./services/auth-service";
import getDB from "./db/db";
import { RegistrationFields } from "./models/auth-interfaces";

for (let i = 0; i < 100; ++i) {
    const email = `firstlast${i}@email.com`;
    const fields: RegistrationFields = {
        email,
        fullname: `First Last${i}`,
        birthdate: "1999-01-01",
        password: "password"
    }
    authService.register(fields, getDB());
}