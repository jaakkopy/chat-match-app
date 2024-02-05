import dotenv from "dotenv";
if (process.env.NODE_ENV == "test") {
    dotenv.config({path: '.env.test'});
} else {
    dotenv.config();
}
import authService from "./services/auth-service";
import getDB from "./db/db";
import query from "./db/pool";
import { RegistrationFields } from "./models/auth-interfaces";

(async () => { 
    // Register the users
    for (let i = 0; i < 100; ++i) {
        const email = `firstlast${i}@email.com`;
        const fields: RegistrationFields = {
            email,
            fullname: `First Last${i}`,
            birthdate: "1999-01-01",
            password: "password"
        }
        await authService.register(fields, getDB());
    }
    // make everyone like 'First Last1':
    await query("INSERT INTO likes (liker, liked) SELECT u1.id, x FROM users u1 CROSS JOIN (SELECT u2.id AS x FROM users u2 WHERE u2.email = 'firstlast0@email.com') WHERE u1.id != x;");
    // make 'First Last0' like everyone else:
    await query("INSERT INTO likes (liker, liked) SELECT x, u1.id FROM users u1 CROSS JOIN (SELECT u2.id AS x FROM users u2 WHERE u2.email = 'firstlast0@email.com') WHERE u1.id != x;");
})();