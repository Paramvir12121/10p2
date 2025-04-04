import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import fs from 'fs/promises';
import path from 'path';

async function setupDatabase() {
  try {
    console.log('Initializing database...');
    
    // Ensure db directory exists
    const dbDir = path.resolve(process.cwd(), 'db');
    console.log('Database directory:', dbDir);
    
    try {
      await fs.access(dbDir);
      console.log('Database directory exists');
    } catch (error) {
      console.log('Creating database directory...');
      await fs.mkdir(dbDir, { recursive: true });
    }
    
    // Create schema file if it doesn't exist
    const schemaPath = path.join(dbDir, 'schema.sql');
    console.log('Schema path:', schemaPath);
    
    try {
      await fs.access(schemaPath);
      console.log('Schema file exists');
    } catch (error) {
      console.log('Schema file not found at:', schemaPath);
      // Copy schema from frontend if it exists
      try {
        const frontendSchemaPath = path.resolve(process.cwd(), 'frontend/db/schema.sql');
        console.log('Looking for schema at:', frontendSchemaPath);
        const schemaContent = await fs.readFile(frontendSchemaPath, 'utf-8');
        console.log('Schema found in frontend, copying...');
        await fs.writeFile(schemaPath, schemaContent);
        console.log('Schema copied to:', schemaPath);
      } catch (copyError) {
        console.error('Error copying schema:', copyError);
        console.log('Creating sample schema...');
        const sampleSchema = `
-- Schema for SQLite database

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;
        await fs.writeFile(schemaPath, sampleSchema);
        console.log('Basic schema created');
      }
    }
    
    // Open database connection
    const dbPath = path.join(dbDir, 'tasks.sqlite');
    console.log('Database path:', dbPath);
    
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    console.log('Database connection opened');
    
    // Execute schema
    const schemaSQL = await fs.readFile(schemaPath, 'utf-8');
    await db.exec(schemaSQL);
    console.log('Schema executed');
    
    // Test the database
    const version = await db.get('SELECT sqlite_version() as version');
    console.log('SQLite version:', version.version);
    
    // Add a test user
    await db.run(
      'INSERT INTO users (username) VALUES (?) ON CONFLICT(username) DO NOTHING',
      ['test_user']
    );
    console.log('Test user created or already exists');
    
    // List tables
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('\nTables in database:');
    for (const table of tables) {
      console.log(`- ${table.name}`);
      const columns = await db.all(`PRAGMA table_info(${table.name})`);
      columns.forEach(col => {
        console.log(`  • ${col.name} (${col.type})`);
      });
    }
    
    // Test query for users
    const users = await db.all('SELECT * FROM users');
    console.log('\nUsers in database:', users);
    
    await db.close();
    console.log('\nDatabase setup complete!');
  } catch (error) {
    console.error('Database setup failed:', error);
  }
}

setupDatabase();
