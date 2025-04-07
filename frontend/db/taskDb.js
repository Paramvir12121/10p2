import { getDb } from './db.js';

export const TaskDb = {
  async getOrCreateUser(username) {
    const db = await getDb();
    let user = await db.get('SELECT * FROM users WHERE username = $1', [username]);

    if (!user) {
      const result = await db.run(
        'INSERT INTO users (username) VALUES ($1) RETURNING id, username, created_at',
        [username]
      );
      user = result;
    }

    return user;
  },

  async getTasks(userId) {
    const db = await getDb();
    const tasks = await db.all(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return tasks.map(task => ({
      ...task,
      tags: task.tags || [],
    }));
  },

  async createTask(userId, taskData) {
    const db = await getDb();
    const result = await db.run(
      `INSERT INTO tasks (user_id, text, priority, due_date, tags) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, taskData.text, taskData.priority, taskData.dueDate, taskData.tags || null]
    );
    return result;
  },
};