import React, { memo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, CheckCircle } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';

const MainTask = ({ focusTask, onComplete, isReceivingTask = false }) => {
    // Set up the drop area for the focus task
    const { setNodeRef, isOver } = useDroppable({
        id: 'focus-area',
        data: {
            type: 'focus-area',
        }
    });

    // Determine animation classes based on drop state
    const dropAnimation = isOver 
        ? 'ring-4 ring-primary/30 scale-[1.02] transition-all duration-300 ease-out' 
        : 'transition-all duration-200 ease-in';

    // Receiving animation when a task is being moved to the focus area
    const receivingAnimation = isReceivingTask
        ? 'bg-primary/5 ring-2 ring-primary/20 scale-[1.01]'
        : '';

    return (
        <Card 
            ref={setNodeRef} 
            className={`p-4 shadow-sm max-w-md transition-all ${dropAnimation} ${receivingAnimation}`}
        >
            <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Current Focus</h2>
            </div>
            
            {focusTask ? (
                <div className={`border rounded-lg p-3 ${isOver ? 'bg-primary/10 border-primary/40' : 'bg-primary/5 border-primary/20'} transition-colors`}>
                    <p className="text-base font-medium mb-2">{focusTask.text}</p>
                    <div className="flex justify-end">
                        <Button 
                            size="sm" 
                            variant="outline" 
                            className="gap-1"
                            onClick={() => onComplete(focusTask.id)}
                        >
                            <CheckCircle className="h-4 w-4" />
                            Complete
                        </Button>
                    </div>
                </div>
            ) : (
                <div className={`text-center py-8 text-muted-foreground rounded-lg transition-all ${
                    isOver 
                        ? 'bg-primary/10 border-2 border-dashed border-primary/40' 
                        : 'border border-dashed border-primary/20'
                } ${isReceivingTask ? 'animate-pulse' : ''}`}>
                    {isOver ? (
                        <>
                            <p className="font-medium text-primary">Drop to set as focus</p>
                            <p className="text-sm">Release to add this task as your main focus</p>
                        </>
                    ) : (
                        <>
                            <p>No active task set</p>
                            <p className="text-sm">Drag a task here or add tasks to your list</p>
                        </>
                    )}
                </div>
            )}
        </Card>
    );
};

export default memo(MainTask);