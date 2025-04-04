import { getDb } from './db.js';

/**
 * Session data access functions
 */
export const SessionDb = {
  // Start a new session
  async startSession(userId, sessionType) {
    const db = await getDb();
    
    const result = await db.run(
      'INSERT INTO sessions (user_id, start_time, session_type) VALUES (?, CURRENT_TIMESTAMP, ?)',
      [userId, sessionType]
    );
    
    return await db.get('SELECT * FROM sessions WHERE id = ?', [result.lastID]);
  },
  
  // End a session
  async endSession(sessionId) {
    const db = await getDb();
    
    // Get session start time to calculate duration
    const session = await db.get('SELECT start_time FROM sessions WHERE id = ?', [sessionId]);
    if (!session) {
      throw new Error('Session not found');
    }
    
    // Update session with end time and duration
    await db.run(`
      UPDATE sessions 
      SET end_time = CURRENT_TIMESTAMP,
          duration = ROUND((JULIANDAY(CURRENT_TIMESTAMP) - JULIANDAY(start_time)) * 86400)
      WHERE id = ?
    `, [sessionId]);
    
    return await db.get('SELECT * FROM sessions WHERE id = ?', [sessionId]);
  },
  
  // Get all sessions for a user
  async getSessions(userId) {
    const db = await getDb();
    return await db.all(
      'SELECT * FROM sessions WHERE user_id = ? ORDER BY start_time DESC',
      [userId]
    );
  },
  
  // Get session statistics for a user
  async getSessionStats(userId) {
    const db = await getDb();
    
    return await db.get(`
      SELECT 
        COUNT(*) as total_sessions,
        SUM(CASE WHEN session_type = 'work' THEN 1 ELSE 0 END) as work_sessions,
        SUM(CASE WHEN session_type = 'break' THEN 1 ELSE 0 END) as break_sessions,
        SUM(duration) as total_duration,
        SUM(CASE WHEN session_type = 'work' THEN duration ELSE 0 END) as work_duration,
        SUM(CASE WHEN session_type = 'break' THEN duration ELSE 0 END) as break_duration
      FROM sessions
      WHERE user_id = ? AND duration IS NOT NULL
    `, [userId]);
  },
  
  // Get tasks completed in a session
  async getSessionCompletedTasks(sessionId) {
    const db = await getDb();
    
    return await db.all(`
      SELECT t.*, tc.completed_at
      FROM task_completions tc
      JOIN tasks t ON tc.task_id = t.id
      WHERE tc.session_id = ?
      ORDER BY tc.completed_at
    `, [sessionId]);
  }
};
