// actions.js
'use server'
import { DynamoDBClient, DescribeTableCommand, CreateTableCommand, waitUntilTableExists } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"

// Flag to track database availability
let isDatabaseAvailable = true;
// Flag to ensure table check runs only once per process
let isTableChecked = false;

// Create DB clients only if credentials are available
const dbClient = (() => {
  try {
    if (!process.env.DYNAMODB_ACCESS_KEY_ID || !process.env.DYNAMODB_SECRET_ACCESS_KEY || !process.env.DYNAMODB_REGION) {
      console.warn('Missing DynamoDB credentials in environment variables. Some features will be limited.');
      isDatabaseAvailable = false;
      return null;
    }
    
    return new DynamoDBClient({
      credentials: {
        accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID,
        secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY,
      },
      region: process.env.DYNAMODB_REGION,
      endpoint: process.env.DYNAMODB_ENDPOINT
    });
  } catch (error) {
    console.error('Error initializing DynamoDB client:', error);
    isDatabaseAvailable = false;
    return null;
  }
})();

const docClient = dbClient ? DynamoDBDocumentClient.from(dbClient) : null;
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'FocusAppData';

async function ensureTableExists() {
  // Skip if already checked, table name is not defined, or database is unavailable
  if (isTableChecked || !TABLE_NAME || !isDatabaseAvailable || !dbClient) {
    return;
  }
  
  console.log(`Checking if table '${TABLE_NAME}' exists...`);
  try {
    await dbClient.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
    console.log(`Table '${TABLE_NAME}' already exists.`);
    isTableChecked = true;
  } catch (error) {
    // Handle authentication errors differently from table-not-found errors
    if (error.name === 'UnrecognizedClientException' || 
        error.name === 'InvalidSignatureException' || 
        error.name === 'CredentialsError' ||
        error.message.includes('security token') ||
        error.message.includes('credentials')) {
      
      console.error('Authentication error with DynamoDB:', error);
      isDatabaseAvailable = false;
      isTableChecked = true; // Mark as checked to prevent further attempts
      return; // Exit without throwing to allow app to function without DB
    }
    
    if (error.name === 'ResourceNotFoundException') {
      console.log(`Table '${TABLE_NAME}' not found. Attempting to create...`);
      const createTableParams = {
        TableName: TABLE_NAME,
        BillingMode: 'PAY_PER_REQUEST',
        AttributeDefinitions: [
          { AttributeName: 'PK', AttributeType: 'S' },
          { AttributeName: 'SK', AttributeType: 'S' },
          { AttributeName: 'GSI1PK', AttributeType: 'S' },
          { AttributeName: 'GSI1SK', AttributeType: 'S' },
          { AttributeName: 'GSI3PK', AttributeType: 'S' },
          { AttributeName: 'GSI3SK', AttributeType: 'S' }
        ],
        KeySchema: [
          { AttributeName: 'PK', KeyType: 'HASH' },
          { AttributeName: 'SK', KeyType: 'RANGE' }
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'GSI1',
            KeySchema: [
              { AttributeName: 'GSI1PK', KeyType: 'HASH' },
              { AttributeName: 'GSI1SK', KeyType: 'RANGE' }
            ],
            Projection: { ProjectionType: 'ALL' }
          },
          {
            IndexName: 'GSI3',
            KeySchema: [
              { AttributeName: 'GSI3PK', KeyType: 'HASH' },
              { AttributeName: 'GSI3SK', KeyType: 'RANGE' }
            ],
            Projection: { ProjectionType: 'ALL' }
          }
        ]
      };
      try {
        await dbClient.send(new CreateTableCommand(createTableParams));
        console.log(`Table '${TABLE_NAME}' creation initiated. Waiting for it to become active...`);
        await waitUntilTableExists({ client: dbClient, maxWaitTime: 180 }, { TableName: TABLE_NAME });
        console.log(`Table '${TABLE_NAME}' created successfully and is active.`);
        isTableChecked = true;
      } catch (creationError) {
        console.error(`Error creating table '${TABLE_NAME}':`, creationError);
        if (creationError.name.includes('Credentials') || 
            creationError.message.includes('security token') ||
            creationError.message.includes('credentials')) {
          isDatabaseAvailable = false;
        }
        isTableChecked = true;
        return; // Exit without throwing to allow app to function without DB
      }
    } else {
      console.error(`Error checking table '${TABLE_NAME}':`, error);
      isTableChecked = true;
      isDatabaseAvailable = false;
    }
  }
}

export const createNewUser = async (username) => {
  await ensureTableExists();
  if (!username || typeof username !== 'string' || username.trim() === '') {
    return { success: false, error: 'Valid username is required' };
  }
  
  const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();
  
  // If database is unavailable, return local-only success
  if (!isDatabaseAvailable || !docClient) {
    console.warn('Creating user in local-only mode due to database unavailability');
    return { 
      success: true, 
      userData: {
        userId,
        username,
        createdAt: timestamp
      },
      localOnly: true
    };
  }
  
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: {
      PK: `USER#${userId}`,
      SK: `METADATA`,
      GSI1PK: `USER#${userId}`,
      GSI1SK: `USER`,
      GSI3PK: `USER#${userId}`,
      GSI3SK: `DATE#${timestamp.split('T')[0].replace(/-/g, '')}`,
      EntityType: 'USER',
      Data: {
        userId,
        username,
        createdAt: timestamp,
        settings: {
          theme: 'system',
          notifications: true,
          defaultTimerDuration: 25 * 60,
          defaultBreakDuration: 5 * 60,
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
      CreatedAt: timestamp,
      UpdatedAt: timestamp
    },
    ConditionExpression: "attribute_not_exists(PK)"
  };

  try {
    await docClient.send(new PutCommand(params));
    
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
    
    if (error.name.includes('Credentials') || 
        error.message.includes('security token') ||
        error.message.includes('credentials')) {
      isDatabaseAvailable = false;
      return { 
        success: true, 
        userData: { userId, username, createdAt: timestamp },
        localOnly: true,
        error: 'Database connection unavailable, user created locally only'
      };
    }
    
    if (error.name === 'ConditionalCheckFailedException') {
      return { success: false, error: 'Username already taken' };
    }
    
    return { success: false, error: error.message };
  }
}

export const checkUserExists = async (username) => {
  await ensureTableExists();
  if (!username || typeof username !== 'string' || username.trim() === '') {
    return { exists: false, error: 'Valid username is required' };
  }
  
  if (!isDatabaseAvailable || !docClient) {
    console.warn('Skipping user existence check due to database unavailability');
    return { exists: false, localOnly: true };
  }
  
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `USERNAME#${username.toLowerCase()}`
      }
    };
    
    const result = await docClient.send(new QueryCommand(params));
    
    if (result.Items && result.Items.length > 0) {
      return { 
        exists: true, 
        userId: result.Items[0].Data.userId 
      };
    }
    
    return { exists: false };
  } catch (error) {
    console.error('Error checking if user exists:', error);
    
    if (error.name.includes('Credentials') || 
        error.message.includes('security token') ||
        error.message.includes('credentials')) {
      isDatabaseAvailable = false;
      return { exists: false, localOnly: true };
    }
    
    return { 
      exists: false, 
      error: `Error checking username: ${error.message}` 
    };
  }
}


