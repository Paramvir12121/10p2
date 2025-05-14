'use server';

import { connectToDatabase } from '@/db/mongodbClient';

const COLLECTION_NAME = process.env.MONGODB_COLLECTION || 'users';

/**
 * Creates a new user in the database
 * @param {string} username - The username to create
 * @returns {Object} Result of the operation
 */
export async function createUser(username) {
  if (!username || typeof username !== 'string' || username.trim() === '') {
    return { success: false, error: 'Valid username is required' };
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection(COLLECTION_NAME);
    
    // Check if username already exists
    const existingUser = await collection.findOne({ 
      username: { $regex: new RegExp(`^${username}$`, 'i') } 
    });
    
    if (existingUser) {
      return { success: false, error: 'Username already exists' };
    }
    
    // Create user document with unique ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    
    const result = await collection.insertOne({
      _id: userId,
      username,
      createdAt: timestamp,
      updatedAt: timestamp,
      settings: {
        theme: 'system',
        notifications: true
      },
      tasks: []
    });
    
    if (result.acknowledged) {
      return { 
        success: true, 
        user: { userId, username, createdAt: timestamp } 
      };
    } else {
      return { success: false, error: 'Failed to create user' };
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return { 
      success: false, 
      error: 'Database error. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
  }
}

/**
 * Retrieves a user by username
 * @param {string} username - Username to find
 * @returns {Object} User data or error
 */
export async function getUserByUsername(username) {
  if (!username) {
    return { success: false, error: 'Username is required' };
  }
  
  try {
    const { db } = await connectToDatabase();
    const user = await db.collection(COLLECTION_NAME).findOne({ 
      username: { $regex: new RegExp(`^${username}$`, 'i') }
    });
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return { 
      success: true, 
      user: {
        userId: user._id,
        username: user.username,
        createdAt: user.createdAt,
        settings: user.settings
      }
    };
  } catch (error) {
    console.error('Error finding user:', error);
    return { 
      success: false, 
      error: 'Database error. Please try again later.' 
    };
  }
}

/**
 * Saves user tasks to database
 * @param {string} userId - User ID
 * @param {Array} tasks - Tasks to save
 * @returns {Object} Result of operation
 */
export async function saveTasks(userId, tasks) {
  if (!userId) {
    return { success: false, error: 'User ID is required' };
  }
  
  try {
    const { db } = await connectToDatabase();
    
    // Update the user document with the new tasks
    const result = await db.collection(COLLECTION_NAME).updateOne(
      { _id: userId },
      { 
        $set: { 
          tasks: tasks,
          updatedAt: new Date().toISOString() 
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      return { success: false, error: 'User not found' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving tasks:', error);
    return { success: false, error: 'Failed to save tasks' };
  }
}