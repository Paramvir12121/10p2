import { getDb } from './db.js';

/**
 * Task data access functions
 */
export const TaskDb = {
  // Create a new user or get existing
  async getOrCreateUser(username) {
    const db = await getDb();
    
    // Try to find user first
    let user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    
    // Create if doesn't exist
    if (!user) {
      const result = await db.run(
        'INSERT INTO users (username) VALUES (?)',
        [username]
      );
      user = await db.get('SELECT * FROM users WHERE id = ?', [result.lastID]);
    }
    
    return user;
  },
  
  // Get all tasks for a user
  async getTasks(userId) {
    const db = await getDb();
    const tasks = await db.all(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    // Parse tags from JSON string
    return tasks.map(task => ({
      ...task,
      tags: task.tags ? JSON.parse(task.tags) : []
    }));
  },
  
  // Create a new task
  async createTask(userId, taskData) {
    const db = await getDb();
    
    // Convert tags array to JSON string
    const tags = taskData.tags ? JSON.stringify(taskData.tags) : null;
    
    const result = await db.run(
      `INSERT INTO tasks (user_id, text, priority, due_date, tags) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, taskData.text, taskData.priority, taskData.dueDate, tags]
    );
    
    return await db.get('SELECT * FROM tasks WHERE id = ?', [result.lastID]);
  },
  
  // Update a task
  async updateTask(taskId, taskData) {
    const db = await getDb();
    
    // Build update query dynamically
    let updateFields = [];
    let params = [];
    
    if (taskData.text !== undefined) {
      updateFields.push('text = ?');
      params.push(taskData.text);
    }
    
    if (taskData.completed !== undefined) {
      updateFields.push('completed = ?');
      params.push(taskData.completed ? 1 : 0);
      
      // If completed, set completed_at timestamp
      if (taskData.completed) {
        updateFields.push('completed_at = CURRENT_TIMESTAMP');
      } else {
        updateFields.push('completed_at = NULL');
      }
    }
    
    if (taskData.priority !== undefined) {
      updateFields.push('priority = ?');
      params.push(taskData.priority);
    }
    
    if (taskData.dueDate !== undefined) {
      updateFields.push('due_date = ?');
      params.push(taskData.dueDate);
    }
    
    if (taskData.tags !== undefined) {
      updateFields.push('tags = ?');
      params.push(JSON.stringify(taskData.tags));
    }
    
    // Add taskId as the last parameter
    params.push(taskId);
    
    if (updateFields.length > 0) {
      await db.run(
        `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ?`,
        params
      );
    }
    
    return await db.get('SELECT * FROM tasks WHERE id = ?', [taskId]);
  },
  
  // Delete a task
  async deleteTask(taskId) {
    const db = await getDb();
    await db.run('DELETE FROM tasks WHERE id = ?', [taskId]);
    return true;
  },
  
  // Mark task as completed (also records in task_completions if sessionId provided)
  async completeTask(taskId, sessionId = null) {
    const db = await getDb();
    
    // Begin transaction
    await db.run('BEGIN TRANSACTION');
    
    try {
      // Update task
      await db.run(
        `UPDATE tasks SET completed = 1, completed_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [taskId]
      );
      
      // If session ID provided, record completion
      if (sessionId) {
        await db.run(
          'INSERT INTO task_completions (task_id, session_id) VALUES (?, ?)',
          [taskId, sessionId]
        );
      }
      
      await db.run('COMMIT');
      return true;
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  }
};
