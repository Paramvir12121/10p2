'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, ListTodo, Plus, Trash2, Target } from 'lucide-react';

export function TaskList({ tasks, setTaskAsFocus, toggleTaskCompletion, addTask, deleteTask, reorderTasks }) {
  const [newTaskText, setNewTaskText] = useState('');
  
  // Handle form submission to add a new task
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask(newTaskText);
      setNewTaskText('');
    }
  };

  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader className="pb-2 bg-card/5 card-header">
        <CardTitle className="text-xl flex items-center gap-2"> {/* Increased from text-lg */}
          <ListTodo className="h-5 w-5" /> Task List
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="p-4 border-b">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Add a new task..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              className="flex-1 text-base"        />
            <Button type="submit" size="sm">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add</span>
            </Button>
          </div>
        </form>
        
        <ScrollArea className="h-64 px-4">
          <div className="py-2 space-y-2">
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
                <ListTodo className="h-10 w-10 mb-2 opacity-40" />
                <p className="text-base">No tasks yet</p> {/* Increased from default text size */}
                <p className="text-sm mt-1">Add some tasks to get started</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="flex items-center p-2 rounded-md hover:bg-muted/50 group">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`p-0 h-6 w-6 mr-2 ${task.completed ? 'text-primary' : 'text-muted-foreground'}`}
                    onClick={() => toggleTaskCompletion(task.id)}
                  >
                    <CheckCircle className={`h-5 w-5 ${task.completed ? 'fill-primary/20' : ''}`} />
                    <span className="sr-only">{task.completed ? 'Mark incomplete' : 'Complete'}</span>
                  </Button>
                  <span 
                    className={`flex-1 text-base ${task.completed ? 'line-through text-muted-foreground' : ''}`}  >
                    {task.text}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => setTaskAsFocus(task.id)}
                      disabled={task.completed}
                    >
                      <Target className="h-4 w-4" />
                      <span className="sr-only">Focus</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
