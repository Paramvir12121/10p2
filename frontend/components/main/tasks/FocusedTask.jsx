'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Target, XCircle } from 'lucide-react';

export function FocusedTask({ focusTask, toggleTaskCompletion }) {
  if (!focusTask) {
    return (
      <Card className="shadow-md overflow-hidden">
        <CardHeader className="pb-2 bg-primary/5 card-header">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" /> Current Focus
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center min-h-32 text-center text-muted-foreground">
            <Target className="h-12 w-12 mb-3 opacity-40" />
            <p>No task selected</p>
            <p className="text-sm mt-1">Select a task from your list to focus on it</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-md overflow-hidden ${focusTask.completed ? 'opacity-90' : ''}`}>
      <CardHeader className="pb-2 bg-primary/5 card-header">
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="h-5 w-5" /> Current Focus
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col">
          <div className="flex items-start mb-4">
            <div className="flex-1 mr-4">
              <h3 className={`font-medium text-lg ${focusTask.completed ? 'line-through opacity-70' : ''}`}>
                {focusTask.text}
              </h3>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <Button 
              variant={focusTask.completed ? "outline" : "default"} 
              className="flex-1 mr-2"
              onClick={() => toggleTaskCompletion(focusTask.id)}
            >
              {focusTask.completed ? (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Mark Incomplete
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
