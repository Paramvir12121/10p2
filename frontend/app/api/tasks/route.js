import { TaskDb } from '@/db/taskDb';

// Get tasks for a user
export async function GET(request) {
  try {
    // Get userId from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const tasks = await TaskDb.getTasks(userId);
    
    return new Response(JSON.stringify(tasks), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error getting tasks:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Create a new task
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, ...taskData } = body;
    
    if (!userId || !taskData.text) {
      return new Response(JSON.stringify({ error: 'User ID and task text are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const task = await TaskDb.createTask(userId, taskData);
    
    return new Response(JSON.stringify(task), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
