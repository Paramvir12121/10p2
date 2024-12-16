'use client';

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button"; 
import TodoItem from "./TodoItem";
import { useState } from "react";
import DashboardCard from "@/components/custom/DashboardCard";
import {DndContext, useDraggable, useDroppable} from '@dnd-kit/core';

function Droppable() {
    const {setNodeRef} = useDroppable({
      id: 'todo',
      data: {
        accepts: ['todo', 'type2'],
      },
    });
  
    /* ... */
  }

  const handleDragEnd = (event) => {
    const {active, over} = event;
    if (over && over.id === 'timer') {
      // Handle drop into timer
      console.log('Dropped todo into timer:', active.id);
    }
  };
  



export default function Todo({addTimerSessioninfo, getTimerSessioninfo}) {
    let [todos, setTodos] = useState([
        { id: 1, title: "Learn React", completed: true },
        { id: 2, title: "Learn Next.js", completed: false },
        { id: 3, title: "Learn Tailwind CSS", completed: false },
        { id: 4, title: "Learn GraphQL", completed: false },
        { id: 5, title: "Learn TypeScript", completed: false },
        { id: 6, title: "Learn Webpack", completed: false },
        { id: 7, title: "Learn Babel", completed: false },
    ]);

    


    const [newTodo, setNewTodo] = useState("");

    const handleAddTodo = () => {
        if (newTodo.trim() === '') return;
    
        // Create and add new todo
        const newTodoItem = {
            id: Date.now(),
            title: newTodo,
            completed: false
        };
        setTodos([...todos, newTodoItem]);
        
        // Clear the input
        setNewTodo('');
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    }

    const deleteTodo = (id) => {   
        setTodos(todos.filter(todo => todo.id !== id));
    }


    return (
        <>
        
        <DndContext>
            <DashboardCard title="Pending Todos">
                {todos.filter(todo => !todo.completed).map((todo) => (
                    <TodoItem 
                        key={todo.id}
                        {...todo}
                        toggleTodo={toggleTodo}
                        deleteTodo={deleteTodo}
                    />
                ))}
                
                <div className="add-todo">
                    <Input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Add a new todo"
                    />
                    <Button onClick={handleAddTodo}>Add</Button>
                </div>
            </DashboardCard>
           
            <DashboardCard title="Completed Todos">
                {todos.filter(todo => todo.completed).map((todo) => (
                    <TodoItem 
                        key={todo.id}
                        {...todo}
                        toggleTodo={toggleTodo}
                        deleteTodo={deleteTodo}
                    />
                ))}
            </DashboardCard>
        </DndContext>

    </>
    );
}