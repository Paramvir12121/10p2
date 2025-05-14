import {MongoClient} from 'mongodb';


let client=null
let clientPromise=null

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'focusApp';


if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
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
      });
      
      // Connect and create a promise we can reuse
      clientPromise = client.connect()
        .then((connectedClient) => {
          console.log('Connected to MongoDB');
          return {
            client: connectedClient,
            db: connectedClient.db(MONGODB_DB)
          };
        });
    }

    return clientPromise;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
