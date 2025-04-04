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
    
    // Use the TaskDb.getOrCreateUser function that already handles checking for existing users
    const user = await TaskDb.getOrCreateUser(username.trim());
    
    // Return the user data with id and username
    return {
      id: user.id,
      username: user.username,
      createdAt: user.created_at
    };
  } catch (error) {
    console.error('Error getting/creating user:', error);
    throw new Error('Failed to get or create user');
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
