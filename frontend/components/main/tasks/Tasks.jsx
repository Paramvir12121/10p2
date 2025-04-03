'use client';

import React, { useState, useCallback, memo, useRef, useEffect } from 'react';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ListTodo, Search, X, Filter, Calendar, Tag, CheckSquare, GripVertical } from 'lucide-react';
import { SortableTask } from './SortableTask';
import { 
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu';

const Tasks = ({ 
    tasks, 
    focusTaskId, 
    onAddTask, 
    onToggleTask, 
    onDeleteTask,
    onBatchAction,
    registerTaskRef,
    animatingTaskId
}) => {
    const [newTask, setNewTask] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [tagFilter, setTagFilter] = useState(null);
    const inputRef = useRef(null);
    
    // Extract all unique tags from tasks
    const allTags = [...new Set(tasks.flatMap(task => task.tags || []))];
    
    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl/Cmd + K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setShowSearch(true);
                setTimeout(() => inputRef.current?.focus(), 100);
            }
            
            // Escape to clear search
            if (e.key === 'Escape' && showSearch) {
                setShowSearch(false);
                setSearchQuery('');
            }
            
            // Ctrl/Cmd + N to add new task
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                document.getElementById('new-task-input')?.focus();
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showSearch]);
    
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
    
    // Toggle task selection for batch operations
    const toggleTaskSelection = useCallback((taskId) => {
        setSelectedTasks(prev => 
            prev.includes(taskId) 
                ? prev.filter(id => id !== taskId) 
                : [...prev, taskId]
        );
    }, []);
    
    // Handle batch actions on selected tasks
    const handleBatchAction = useCallback((action) => {
        if (selectedTasks.length === 0) return;
        
        onBatchAction?.(action, selectedTasks);
        setSelectedTasks([]);
    }, [selectedTasks, onBatchAction]);

    // Filter and search tasks
    const filteredTasks = tasks.filter(task => {
        // Filter by tab
        if (activeTab === 'active' && task.completed) return false;
        if (activeTab === 'completed' && !task.completed) return false;
        
        // Filter by search query
        if (searchQuery && !task.text.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        
        // Filter by tag
        if (tagFilter && (!task.tags || !task.tags.includes(tagFilter))) {
            return false;
        }
        
        return true;
    });

    return (
        <Card className="rounded-md border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden ">
            <div className="flex items-center justify-between p-1.5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 card-header">
                <div className="flex items-center gap-1 text-[13px] font-medium">
                    <ListTodo className="h-3.5 w-3.5 text-primary/70" />
                    Task List
                </div>
                
                <div className="flex items-center gap-1">
                    {/* Search button */}
                    <Button 
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => {
                            setShowSearch(!showSearch);
                            if (!showSearch) setTimeout(() => inputRef.current?.focus(), 100);
                        }}
                    >
                        <Search className="h-3.5 w-3.5" />
                    </Button>
                    
                    {/* Filter dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Filter className="h-3.5 w-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onSelect={() => setTagFilter(null)} className="text-xs">
                                <Calendar className="h-3.5 w-3.5 mr-1.5" /> All Tasks
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            
                            <div className="text-xs p-2 text-muted-foreground">Filter by Tag</div>
                            {allTags.length > 0 ? (
                                allTags.map(tag => (
                                    <DropdownMenuCheckboxItem 
                                        key={tag}
                                        checked={tagFilter === tag}
                                        onCheckedChange={() => setTagFilter(tag === tagFilter ? null : tag)}
                                        className="text-xs"
                                    >
                                        <Tag className="h-3.5 w-3.5 mr-1.5" /> {tag}
                                    </DropdownMenuCheckboxItem>
                                ))
                            ) : (
                                <div className="text-xs p-2 text-center text-muted-foreground">No tags found</div>
                            )}
                            
                            {selectedTasks.length > 0 && (
                                <>
                                    <DropdownMenuSeparator />
                                    <div className="text-xs p-2 text-muted-foreground">Batch Actions</div>
                                    <DropdownMenuItem 
                                        onSelect={() => handleBatchAction('complete')}
                                        className="text-xs"
                                    >
                                        <CheckSquare className="h-3.5 w-3.5 mr-1.5" /> 
                                        Complete Selected ({selectedTasks.length})
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onSelect={() => handleBatchAction('delete')}
                                        className="text-xs text-destructive"
                                    >
                                        <X className="h-3.5 w-3.5 mr-1.5" /> 
                                        Delete Selected ({selectedTasks.length})
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    
                    {/* Drag handle */}
                    <div className="card-header h-6 w-6 flex items-center justify-center rounded-sm hover:bg-muted/80">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
            </div>
            
            <div className="p-2">
                {/* Search bar (conditionally rendered) */}
                {showSearch && (
                    <div className="flex mb-1.5">
                        <Input
                            ref={inputRef}
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-grow mr-1 text-[13px] h-7 rounded-sm"
                        />
                        <Button 
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => {
                                setSearchQuery('');
                                setShowSearch(false);
                            }}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                )}
                
                {/* Task input form */}
                <div className="flex mb-1.5">
                    <Input
                        id="new-task-input"
                        type="text"
                        placeholder="Add a new task"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-grow mr-1 text-[13px] h-7 rounded-sm"
                    />
                    <Button 
                      className="text-[13px] px-2 h-7 rounded-sm" 
                      onClick={handleAddTask}
                    >
                      Add
                    </Button>
                </div>
                
                {/* Task filtering tabs */}
                <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="w-full mb-1.5 h-6 p-0.5 rounded-sm">
                        <TabsTrigger value="all" className="flex-1 text-[12px] h-5 rounded-sm">All</TabsTrigger>
                        <TabsTrigger value="active" className="flex-1 text-[12px] h-5 rounded-sm">Active</TabsTrigger>
                        <TabsTrigger value="completed" className="flex-1 text-[12px] h-5 rounded-sm">Completed</TabsTrigger>
                    </TabsList>
                    
                    {/* Task sortable context - DndContext moved to parent */}
                    <SortableContext items={filteredTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-1 overflow-y-auto max-h-[35vh] pr-1">
                            {filteredTasks.length === 0 ? (
                                <div className="text-center py-3 text-slate-500 text-[13px] bg-slate-50 dark:bg-slate-900/30 rounded-sm">
                                    {searchQuery 
                                        ? `No tasks matching "${searchQuery}"`
                                        : tagFilter
                                        ? `No tasks with tag "${tagFilter}"`
                                        : "No tasks found"
                                    }
                                </div>
                            ) : (
                                filteredTasks.map(task => (
                                    <SortableTask
                                        key={task.id}
                                        id={task.id}
                                        text={task.text}
                                        completed={task.completed}
                                        isMainTask={task.id === focusTaskId}
                                        isSelected={selectedTasks.includes(task.id)}
                                        onToggle={() => onToggleTask(task.id)}
                                        onDelete={() => onDeleteTask(task.id)}
                                        onSelect={() => toggleTaskSelection(task.id)}
                                        isAnimating={task.id === animatingTaskId}
                                        registerRef={(ref) => registerTaskRef(task.id, ref)}
                                        tags={task.tags}
                                        dueDate={task.dueDate}
                                        priority={task.priority}
                                    />
                                ))
                            )}
                        </div>
                    </SortableContext>
                    
                    {/* Selection status */}
                    {selectedTasks.length > 0 && (
                        <div className="flex items-center justify-between mt-1.5 px-1 py-1 bg-muted/30 rounded-sm text-[12px]">
                            <span>{selectedTasks.length} task(s) selected</span>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-5 px-1 py-0 text-[12px]"
                                onClick={() => setSelectedTasks([])}
                            >
                                Clear
                            </Button>
                        </div>
                    )}
                </Tabs>
            </div>
        </Card>
    );
};

export default memo(Tasks);