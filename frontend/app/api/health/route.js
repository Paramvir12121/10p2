import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/db/mongodbClient';

/**
 * Health check endpoint
 * Returns the application health status including database connectivity
 */
export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    checks: {
      database: 'unknown'
    }
  };

  try {
    // Test database connection
    const { db } = await connectToDatabase();
    await db.admin().ping();
    health.checks.database = 'connected';
  } catch (error) {
    health.status = 'unhealthy';
    health.checks.database = 'disconnected';
    health.error = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Database connection failed';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  
  return NextResponse.json(health, { status: statusCode });
}
