import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs/promises';
import path from 'path';

// Ensure db directory exists
const ensureDbDir = async () => {
  try {
    // Use absolute path for better reliability
    const dbDir = path.resolve(process.cwd(), 'db');
    console.log('DB directory path:', dbDir);
    
    try {
      await fs.access(dbDir);
      console.log('DB directory exists');
    } catch (error) {
      // Directory doesn't exist, create it
      console.log('Creating DB directory');
      await fs.mkdir(dbDir, { recursive: true });
    }
    
    return dbDir;
  } catch (error) {
    console.error('Error ensuring DB directory exists:', error);
    throw error;
  }
};

// Initialize the database connection
export async function openDb() {
  try {
    const dbDir = await ensureDbDir();
    const dbPath = path.join(dbDir, 'tasks.sqlite');
    console.log('DB file path:', dbPath);
    
    // Open the database
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    console.log('Database connection opened successfully');
    
    // Enable foreign keys
    await db.exec('PRAGMA foreign_keys = ON;');
    
    // Load and execute the schema
    try {
      // Try multiple potential schema paths
      const schemaPaths = [
        path.join(dbDir, 'schema.sql'),
        path.resolve(process.cwd(), 'frontend/db/schema.sql'),
        path.resolve(process.cwd(), 'db/schema.sql')
      ];
      
      let schemaSQL = null;
      let usedPath = null;
      
      // Try each path until we find the schema
      for (const schemaPath of schemaPaths) {
        try {
          console.log('Trying schema path:', schemaPath);
          schemaSQL = await fs.readFile(schemaPath, 'utf-8');
          usedPath = schemaPath;
          console.log('Found schema at:', schemaPath);
          break;
        } catch (err) {
          console.log(`Schema not found at: ${schemaPath}`);
        }
      }
      
      if (!schemaSQL) {
        throw new Error(`Schema not found in any of the searched paths: ${schemaPaths.join(', ')}`);
      }
      
      await db.exec(schemaSQL);
      console.log('Schema executed successfully from:', usedPath);
    } catch (schemaError) {
      console.error('Error loading or executing schema:', schemaError);
      throw schemaError;
    }
    
    return db;
  } catch (error) {
    console.error('Error opening database:', error);
    throw error;
  }
}

// Initialize database singleton
let dbInstance = null;

export async function getDb() {
  if (!dbInstance) {
    try {
      dbInstance = await openDb();
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }
  return dbInstance;
}
