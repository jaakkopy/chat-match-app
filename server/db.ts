import {Pool, QueryResult} from 'pg';
import {DB} from './models/db-interface';

import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DATABASE
});

const query = async (queryText: string, parameters?: any[]): Promise<any[]> => {
    const res: QueryResult = await pool.query(queryText, parameters);
    return res.rows;
}

const db: DB = {
    query
}

const getDB = (): DB => {
    return db;
}

export default getDB;
