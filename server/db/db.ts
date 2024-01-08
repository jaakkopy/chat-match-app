import {DB} from '../models/db-interface';
import errors from './db-errors';
import likes from './likes';
import users from './users';
import messages from './chat-messages';

const db: DB = {
    likes,
    users,
    errors,
    messages
}

const getDB = (): DB => {
    return db;
}

export default getDB;
