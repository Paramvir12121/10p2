'use server';

import { connectToDatabase } from '@/db/mongodbClient';
import { sanitizeUsername, sanitizeTaskText, isValidObjectId } from '@/lib/sanitize';
import rateLimiter, { getClientIdentifier } from '@/lib/rateLimit';
import { headers } from 'next/headers';

const COLLECTION_NAME = process.env.MONGODB_COLLECTION || 'users';

/**
 * Check if a user exists by username
 * @param {string} username - Username to check
 * @returns {Object} Result with exists boolean and userId if found
 */
export async function checkUserExists(username) {
  const sanitized = sanitizeUsername(username);
  
  if (!sanitized) {
    return { exists: false, error: 'Invalid username format' };
  }
  
  try {
    const { db } = await connectToDatabase();
    const user = await db.collection(COLLECTION_NAME).findOne({ 
      username: { $regex: new RegExp(`^${sanitized}$`, 'i') }
    });
    
    if (user) {
      return { 
        exists: true, 
        userId: user._id,
        username: user.username 
      };
    }
    
    return { exists: false };
  } catch (error) {
    console.error('Error checking user existence:', error);
    return { exists: false, error: error.message };
  }
}

/**
 * Create a new user (wrapper for createUser with different return format)
 * @param {string} username - The username to create
 * @returns {Object} Result of the operation with userData
 */
export async function createNewUser(username) {
  try {
    const result = await createUser(username);
    
    if (result.success) {
      return {
        success: true,
        userData: {
          userId: result.user.userId,
          username: result.user.username,
          createdAt: result.user.createdAt
        }
      };
    }
    
    return result;
  } catch (error) {
    console.error('Error in createNewUser:', error);
    return {
      success: false,
      error: error.message,
      localOnly: true
    };
  }
}

/**
 * Creates a new user in the database
 * @param {string} username - The username to create
 * @returns {Object} Result of the operation
 */
export async function createUser(username) {
  // Rate limiting: max 5 user creations per hour per IP
  const headersList = await headers();
  const clientId = getClientIdentifier(headersList);
  
  if (rateLimiter.isRateLimited(`create-user-${clientId}`, 5, 3600000)) {
    return { 
      success: false, 
      error: 'Too many requests. Please try again later.' 
    };
  }
  
  const sanitized = sanitizeUsername(username);
  
  if (!sanitized) {
    return { success: false, error: 'Invalid username. Use 3-30 characters (letters, numbers, spaces, hyphens, underscores only)' };
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection(COLLECTION_NAME);
    
    // Check if username already exists
    const existingUser = await collection.findOne({ 
      username: { $regex: new RegExp(`^${sanitized}$`, 'i') } 
    });
    
    if (existingUser) {
      return { success: false, error: 'Username already exists' };
    }
    
    // Create user document with unique ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    
    const result = await collection.insertOne({
      _id: userId,
      username: sanitized,
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
        user: { userId, username: sanitized, createdAt: timestamp } 
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
  // Rate limiting: max 20 requests per minute per IP
  const headersList = await headers();
  const clientId = getClientIdentifier(headersList);
  
  if (rateLimiter.isRateLimited(`get-user-${clientId}`, 20, 60000)) {
    return { 
      success: false, 
      error: 'Too many requests. Please try again later.' 
    };
  }
  
  const sanitized = sanitizeUsername(username);
  
  if (!sanitized) {
    return { success: false, error: 'Invalid username format' };
  }
  
  try {
    const { db } = await connectToDatabase();
    const user = await db.collection(COLLECTION_NAME).findOne({ 
      username: { $regex: new RegExp(`^${sanitized}$`, 'i') }
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
  // Rate limiting: max 30 saves per minute per user
  if (rateLimiter.isRateLimited(`save-tasks-${userId}`, 30, 60000)) {
    return { 
      success: false, 
      error: 'Too many save requests. Please try again later.' 
    };
  }
  
  if (!userId || !isValidObjectId(userId)) {
    return { success: false, error: 'Invalid user ID' };
  }
  
  if (!Array.isArray(tasks)) {
    return { success: false, error: 'Tasks must be an array' };
  }
  
  // Sanitize all task texts
  const sanitizedTasks = tasks.map(task => {
    if (!task || typeof task !== 'object') {
      return null;
    }
    
    const sanitizedText = sanitizeTaskText(task.text);
    if (!sanitizedText) {
      return null;
    }
    
    return {
      ...task,
      text: sanitizedText
    };
  }).filter(Boolean); // Remove any null entries
  
  try {
    const { db } = await connectToDatabase();
    
    // Update the user document with the new tasks
    const result = await db.collection(COLLECTION_NAME).updateOne(
      { _id: userId },
      { 
        $set: { 
          tasks: sanitizedTasks,
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