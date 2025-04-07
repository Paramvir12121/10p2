import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DB || 'focusapp',
  user: process.env.POSTGRES_USER || 'focususer',
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.POSTGRES_SSL === 'true',
});

export async function getDb() {
  try {
    const client = await pool.connect();
    console.log('Database connection established successfully');
    client.release();

    return {
      query: (text, params) => pool.query(text, params),
      get: async (text, params) => {
        const result = await pool.query(text, params);
        return result.rows[0];
      },
      all: async (text, params) => {
        const result = await pool.query(text, params);
        return result.rows;
      },
      run: async (text, params) => {
        const result = await pool.query(text, params);
        return {
          rowCount: result.rowCount,
          lastID: result.rows[0]?.id,
        };
      },
      // New function to fetch all data from all tables
      getAllData: async () => {
        const result = {};
        try {
          result.users = (await pool.query('SELECT * FROM users')).rows;
          result.tasks = (await pool.query('SELECT * FROM tasks')).rows;
          result.sessions = (await pool.query('SELECT * FROM sessions')).rows;
          result.taskCompletions = (await pool.query('SELECT * FROM task_completions')).rows;
        } catch (error) {
          console.error('Error fetching all data:', error);
          throw error;
        }
        return result;
      },
    };
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}