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
  
  // Load and execute the schema
  const schemaPath = path.resolve(process.cwd(), 'db', 'schema.sql');
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
