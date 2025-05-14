'use client';

import { useState } from 'react';
import { getUserByUsername, createUser, saveTasks } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function DbTestPage() {
  const [username, setUsername] = useState('');
  const [result, setResult] = useState(null);
  const [operation, setOperation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTestGetUser = async () => {
    setLoading(true);
    setOperation('get-user');
    try {
      const response = await getUserByUsername(username);
      setResult(response);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleTestCreateUser = async () => {
    setLoading(true);
    setOperation('create-user');
    try {
      const response = await createUser(username);
      setResult(response);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleTestSaveTasks = async () => {
    setLoading(true);
    setOperation('save-tasks');
    try {
      // Get user first to get their ID
      const userResponse = await getUserByUsername(username);
      if (userResponse.success) {
        const sampleTasks = [
          { id: '1', title: 'Test task 1', completed: false },
          { id: '2', title: 'Test task 2', completed: true },
        ];
        const response = await saveTasks(userResponse.user.userId, sampleTasks);
        setResult({ ...response, sampleTasks });
      } else {
        setResult({ error: 'User not found' });
      }
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">MongoDB Connection Test</h1>
      
      <div className="mb-4">
        <label className="block text-sm mb-2">Username for testing</label>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="mb-2"
        />
        
        <div className="flex gap-2 mt-4">
          <Button 
            onClick={handleTestGetUser} 
            disabled={loading || !username}
            variant="outline"
          >
            Get User
          </Button>
          
          <Button 
            onClick={handleTestCreateUser} 
            disabled={loading || !username}
            variant="outline"
          >
            Create User
          </Button>
          
          <Button 
            onClick={handleTestSaveTasks} 
            disabled={loading || !username}
            variant="outline"
          >
            Save Tasks
          </Button>
        </div>
      </div>
      
      {loading && <div className="text-center">Loading...</div>}
      
      {result && (
        <div className="mt-4 border p-4 rounded-md bg-gray-50 dark:bg-gray-900">
          <h3 className="font-semibold mb-2">Operation Result: {operation}</h3>
          <pre className="text-xs overflow-auto p-2 bg-white dark:bg-gray-800 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}