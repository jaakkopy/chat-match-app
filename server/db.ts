import {Pool, QueryResult} from 'pg';

import dotenv from 'dotenv';
// load here as well just in case
dotenv.config();

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DATABASE
});

const query = (queryText: string, parameters?: any[]): Promise<QueryResult> => {
    return pool.query(queryText, parameters);
}

export default query;
