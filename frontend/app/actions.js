// actions.js
'use server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"


const dbClient = new DynamoDBClient({
  credentials: {
    accessKeyId: 'local',
    secretAccessKey: 'local',
  },
  region: 'us-east-1',
  endpoint: 'https://orange-space-potato-5vrwr9jq59xfv6jw-8000.app.github.dev'
})
const docClient = DynamoDBDocumentClient.from(dbClient)



export const createNewUser = async (username) => {
  if (!username || typeof username !== 'string' || username.trim() === '') {
    return { success: false, error: 'Valid username is required' };
  }
  const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();
  
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: {
      // Primary keys using single-table design pattern
      PK: `USER#${userId}`,
      SK: `METADATA`,
      
      // GSI keys for flexible access patterns
      GSI1PK: `USER#${userId}`,
      GSI1SK: `USER`,
      GSI3PK: `USER#${userId}`,
      GSI3SK: `DATE#${timestamp.split('T')[0].replace(/-/g, '')}`,
      
      // Entity metadata
      EntityType: 'USER',
      
      // User data in a nested map for better organization
      Data: {
        userId,
        username,
        createdAt: timestamp,
        settings: {
          theme: 'system',
          notifications: true,
          defaultTimerDuration: 25 * 60, // 25 minutes in seconds
          defaultBreakDuration: 5 * 60,  // 5 minutes in seconds
          soundEnabled: true
        },
        stats: {
          tasksCompleted: 0,
          totalFocusTime: 0,
          totalBreakTime: 0,
          sessionsCompleted: 0,
          streakDays: 0,
          lastActive: timestamp
        }
      },
      
      // Standard timestamps
      CreatedAt: timestamp,
      UpdatedAt: timestamp
    },
    // Ensure we don't overwrite an existing user
    ConditionExpression: "attribute_not_exists(PK)"
  };

  try {
    await docClient.send(new PutCommand(params));
    
    // Also create a username lookup item for easy username-based queries
    const usernameLookupParams = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: {
        PK: `USERNAME#${username.toLowerCase()}`,
        SK: `USER#${userId}`,
        EntityType: 'USERNAME_LOOKUP',
        GSI1PK: `USERNAME`,
        GSI1SK: `${username.toLowerCase()}`,
        Data: {
          userId,
          username
        },
        CreatedAt: timestamp,
        UpdatedAt: timestamp
      },
      ConditionExpression: "attribute_not_exists(PK)"
    };
    
    await docClient.send(new PutCommand(usernameLookupParams));
    
    return { 
      success: true, 
      userData: {
        userId,
        username,
        createdAt: timestamp
      }
    };
  } catch (error) {
    console.error('Error creating new user:', error);
    
    // Check for ConditionCheckFailedException (user already exists)
    if (error.name === 'ConditionalCheckFailedException') {
      return { success: false, error: 'Username already taken' };
    }
    
    return { success: false, error: error.message };
  }

}

export const checkUserExists = async (username) => {
  if (!username || typeof username !== 'string' || username.trim() === '') {
    return { exists: false, error: 'Valid username is required' };
  }
   try {
    // Query the username lookup entry
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `USERNAME#${username.toLowerCase()}`
      }
    };
    
    const result = await docClient.send(new QueryCommand(params));
    
    if (result.Items && result.Items.length > 0) {
      // User exists, return true along with the userId for reference
      return { 
        exists: true, 
        userId: result.Items[0].Data.userId 
      };
    }
    
    // Username doesn't exist
    return { exists: false };
  } catch (error) {
    console.error('Error checking if user exists:', error);
    return { 
      exists: false, 
      error: `Error checking username: ${error.message}` 
    };
  }
  
}


