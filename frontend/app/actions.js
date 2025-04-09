'use server'

import { getDb } from '@/db/db.js';
import { TaskDb } from '@/db/taskDb.js';
import { SessionDb } from '@/db/sessionDb.js';

// Get user data including tasks
export async function getUserData(username) {
  try {
    // Get or create user
    const user = await TaskDb.getOrCreateUser(username);
    
    // Get user's tasks
    const tasks = await TaskDb.getTasks(user.id);
    
    return {
      user,
      tasks
    };
  } catch (error) {
    console.error('Error getting user data:', error);
    throw new Error('Failed to get user data');
  }
}

// Create a user or get existing user
export async function getUserOrCreate(username) {
  try {
    if (!username || typeof username !== 'string' || username.trim() === '') {
      throw new Error('Valid username required');
    }
    
    // Use a direct database connection first to check if the database is accessible
    try {
      console.log('Testing database connection...');
      const db = await getDb();
      
      // Test query to ensure connection works
      await db.get('SELECT 1 as test');
      console.log('Database connection test successful');
      
      // Database connection works, proceed with the actual operation
      console.log('Creating or getting user:', username.trim());
      const user = await TaskDb.getOrCreateUser(username.trim());
      console.log('User retrieved/created:', user);
      
      // Return the user data with id and username
      return {
        id: user.id,
        username: user.username,
        createdAt: user.created_at
      };
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      throw new Error(`Database connection failed: ${dbError.message}`);
    }
  } catch (error) {
    console.error('Error in getUserOrCreate:', error);
    // Don't return a fallback user - let the component handle the error
    throw error;
  }
}


// Get all tasks for a user
export async function getUserTasks(userId) {
  try {
    return await TaskDb.getTasks(userId);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

// Create a new task
export async function createTask(userId, taskData) {
  try {
    return await TaskDb.createTask(userId, taskData);
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}
