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
        <div className="w-full max-w-[320px]">
            <Card className="p-2 shadow-sm mb-4 border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1 mb-1">
                    <ListTodo className="h-3.5 w-3.5 text-primary/70" />
                    <h2 className="text-[13px] font-medium">Task List</h2>
                </div>
                
                {/* Task input form */}
                <div className="flex mb-1.5">
                    <Input
                        type="text"
                        placeholder="Add a new task"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-grow mr-1 text-[11px] h-7 rounded-sm"
                    />
                    <Button 
                      className="text-[11px] px-2 h-7 rounded-sm" 
                      onClick={handleAddTask}
                    >
                      Add
                    </Button>
                </div>
                
                {/* Task filtering tabs */}
                <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="w-full mb-1.5 h-6 p-0.5 rounded-sm">
                        <TabsTrigger value="all" className="flex-1 text-[10px] h-5 rounded-sm">All</TabsTrigger>
                        <TabsTrigger value="active" className="flex-1 text-[10px] h-5 rounded-sm">Active</TabsTrigger>
                        <TabsTrigger value="completed" className="flex-1 text-[10px] h-5 rounded-sm">Completed</TabsTrigger>
                    </TabsList>
                    
                    {/* Task sortable context - DndContext moved to parent */}
                    <SortableContext items={filteredTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-1 overflow-y-auto max-h-[35vh]">
                            {filteredTasks.length === 0 ? (
                                <div className="text-center py-3 text-slate-500 text-[11px] bg-slate-50 dark:bg-slate-900/30 rounded-sm">
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