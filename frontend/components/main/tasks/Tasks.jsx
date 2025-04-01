'use client';

import React, { useState, useCallback, memo } from 'react';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ListTodo } from 'lucide-react';
import { SortableTask } from './SortableTask';

const Tasks = ({ 
    tasks, 
    focusTaskId, 
    onAddTask, 
    onToggleTask, 
    onDeleteTask,
    registerTaskRef,
    animatingTaskId
}) => {
    const [newTask, setNewTask] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    
    // Event handlers with useCallback for better performance
    const handleAddTask = useCallback(() => {
        if (!newTask.trim()) return;
        onAddTask(newTask);
        setNewTask('');
    }, [newTask, onAddTask]);
    
    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            handleAddTask();
        }
    }, [handleAddTask]);

    // Filter tasks based on active tab
    const filteredTasks = tasks.filter(task => {
        if (activeTab === 'all') return true;
        if (activeTab === 'active') return !task.completed;
        if (activeTab === 'completed') return task.completed;
        return true;
    });

    return (
        <div className="w-full max-w-md">
            <Card className="p-4 shadow-sm mb-4">
                <div className="flex items-center gap-1 mb-2">
                    <ListTodo className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-semibold">Task List</h2>
                </div>
                
                {/* Task input form */}
                <div className="flex mb-2">
                    <Input
                        type="text"
                        placeholder="Add a new task"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-grow mr-1 text-sm"
                    />
                    <Button className="text-sm px-2 py-1" onClick={handleAddTask}>Add</Button>
                </div>
                
                {/* Task filtering tabs */}
                <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="w-full mb-2">
                        <TabsTrigger value="all" className="flex-1 text-xs">All</TabsTrigger>
                        <TabsTrigger value="active" className="flex-1 text-xs">Active</TabsTrigger>
                        <TabsTrigger value="completed" className="flex-1 text-xs">Completed</TabsTrigger>
                    </TabsList>
                    
                    {/* Task sortable context - DndContext moved to parent */}
                    <SortableContext items={filteredTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                            {filteredTasks.length === 0 ? (
                                <div className="text-center py-4 text-gray-500 text-sm">
                                    No tasks found
                                </div>
                            ) : (
                                filteredTasks.map(task => (
                                    <SortableTask
                                        key={task.id}
                                        id={task.id}
                                        text={task.text}
                                        completed={task.completed}
                                        isMainTask={task.id === focusTaskId}
                                        onToggle={() => onToggleTask(task.id)}
                                        onDelete={() => onDeleteTask(task.id)}
                                        isAnimating={task.id === animatingTaskId}
                                        registerRef={(ref) => registerTaskRef(task.id, ref)}
                                    />
                                ))
                            )}
                        </div>
                    </SortableContext>
                </Tabs>
            </Card>
        </div>
    );
};

export default memo(Tasks);