import {Pool, QueryResult} from 'pg';

// Environment variables should be loaded first, or this will crash
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DATABASE
});

// Test the connection
try {
    pool.query("SELECT 1;");
} catch (e) {
    console.error(e);
    process.exit(1);
}

export const query = async (queryText: string, parameters?: any[]): Promise<any[]> => {
    const res: QueryResult = await pool.query(queryText, parameters);
    return res.rows;
}

export default query;
