import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, CheckCircle } from 'lucide-react';

const MainTask = ({ tasks }) => {
    // Find the first incomplete task (this would typically come from the Tasks component)
    const [mainTask, setMainTask] = useState(null);
    
    useEffect(() => {
        // In a real app, this would sync with the Tasks component's state
        // For now we're just showing a placeholder
        if (tasks && tasks.length > 0) {
            const firstIncompleteTask = tasks.find(task => !task.completed);
            setMainTask(firstIncompleteTask || null);
        }
    }, [tasks]);

    return (
        <Card className="p-4 shadow-sm max-w-md">
            <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Current Focus</h2>
            </div>
            
            {mainTask ? (
                <div className="border border-primary/20 bg-primary/5 rounded-lg p-3">
                    <p className="text-base font-medium mb-2">{mainTask.text}</p>
                    <div className="flex justify-end">
                        <Button size="sm" variant="outline" className="gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Complete
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    <p>No active task set</p>
                    <p className="text-sm">Add tasks to your list and they'll appear here</p>
                </div>
            )}
        </Card>
    );
};

export default MainTask;