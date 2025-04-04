import { openDb } from './frontend/db/db.js';

async function setupDatabase() {
  try {
    console.log('Initializing database...');
    const db = await openDb();
    
    // Test the database with a simple query
    const version = await db.get('SELECT sqlite_version() as version');
    console.log('SQLite version:', version.version);
    
    // Add a test user
    const result = await db.run(
      'INSERT INTO users (username) VALUES (?) ON CONFLICT(username) DO NOTHING',
      ['test_user']
    );
    
    console.log('Database setup complete!');
    console.log('Test user created or already exists.');
    
    // Display table structure
    console.log('\nTable structure:');
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    for (const table of tables) {
      console.log(`\nTable: ${table.name}`);
      const columns = await db.all(`PRAGMA table_info(${table.name})`);
      columns.forEach(col => {
        console.log(`  - ${col.name} (${col.type})`);
      });
    }
    
    await db.close();
  } catch (error) {
    console.error('Database setup failed:', error);
  }
}

setupDatabase();
