import {MongoClient} from 'mongodb';

let client = null;
let clientPromise = null;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'focusApp';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Validate MongoDB URI format
if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
  throw new Error('Invalid MongoDB URI format');
}

/**
 * Create a new MongoDB client connection or reuse existing one
 */
export async function connectToDatabase() {
  // If we already have a client promise, reuse it
  if (clientPromise) {
    return clientPromise;
  }

  try {
    // Create a new client if necessary
    if (!client) {
      client = new MongoClient(MONGODB_URI, {
        connectTimeoutMS: 5000,
        socketTimeoutMS: 30000,
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
        minPoolSize: 2,
        retryWrites: true,
        retryReads: true,
      });
      
      // Connect and create a promise we can reuse
      clientPromise = client.connect()
        .then((connectedClient) => {
          return {
            client: connectedClient,
            db: connectedClient.db(MONGODB_DB)
          };
        })
        .catch((error) => {
          // Reset client promise on error so next attempt will retry
          clientPromise = null;
          client = null;
          throw error;
        });
    }

    return clientPromise;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Reset state on error
    clientPromise = null;
    client = null;
    throw new Error('Failed to connect to database. Please try again later.');
  }
}

/**
 * Close the MongoDB connection (useful for cleanup in development)
 */
export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    clientPromise = null;
  }
}
