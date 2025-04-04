import { getDb } from '@/db/db.js';

export async function GET() {
  try {
    // Get database connection
    const db = await getDb();
    
    // Execute a test query
    const result = await db.all('SELECT sqlite_version() as version');
    
    return new Response(JSON.stringify({ 
      success: true,
      message: "Database is working",
      version: result[0].version
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
