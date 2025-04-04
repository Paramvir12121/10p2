import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs/promises';
import path from 'path';

// Ensure db directory exists
const ensureDbDir = async () => {
  const dbDir = path.resolve(process.cwd(), 'db');
  try {
    await fs.access(dbDir);
  } catch (error) {
    // Directory doesn't exist, create it
    await fs.mkdir(dbDir, { recursive: true });
  }
};

// Initialize the database connection
export async function openDb() {
  await ensureDbDir();
  
  const dbPath = path.resolve(process.cwd(), 'db', 'tasks.sqlite');
  
  // Open the database
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  
  // Enable foreign keys
  await db.exec('PRAGMA foreign_keys = ON;');
  
  // Load and execute the schema - FIX: Use correct schema path
  // When running from project root, schema is in the frontend/db folder
  let schemaPath = path.resolve(process.cwd(), 'frontend/db/schema.sql');
  
  // Check if schema exists at that path
  try {
    await fs.access(schemaPath);
  } catch (error) {
    // If not found, try the alternate path (when running from inside frontend directory)
    schemaPath = path.resolve(process.cwd(), 'db/schema.sql');
    try {
      await fs.access(schemaPath);
    } catch (error) {
      throw new Error(`Schema file not found at ${schemaPath} or ${path.resolve(process.cwd(), 'frontend/db/schema.sql')}`);
    }
  }
  
  const schemaSQL = await fs.readFile(schemaPath, 'utf-8');
  await db.exec(schemaSQL);
  
  return db;
}

// Initialize database singleton
let dbInstance = null;

export async function getDb() {
  if (!dbInstance) {
    dbInstance = await openDb();
  }
  return dbInstance;
}
