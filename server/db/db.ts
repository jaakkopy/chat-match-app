import {DB} from '../models/db-interface';
import errors from './db-errors';
import likes from './likes';
import users from './users';

const db: DB = {
    likes,
    users,
    errors
}

const getDB = (): DB => {
    return db;
}

export default getDB;
