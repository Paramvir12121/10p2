'use client';

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button"; 
import TodoItem from "./TodoItem";
import { useState } from "react";
import DashboardCard from "@/components/custom/DashboardCard";
import { DndContext, useDraggable, useDroppable, DragOverlay } from '@dnd-kit/core';


function Droppable({ id, children }) {
    const { setNodeRef } = useDroppable({
        id,
        data: {
            accepts: ['todo']
        }
    });

    return (
        <div
            ref={setNodeRef}
            className="droppable"
            id={id}
        >
            {children}
        </div>
    );
}





export default function Todo({addTimerSessioninfo, getTimerSessioninfo}) {
    const [newTodo, setNewTodo] = useState("");
    


    let [todos, setTodos] = useState([
        { id: 1, title: "Learn React", completed: true },
        { id: 2, title: "Learn Next.js", completed: false },
        { id: 3, title: "Learn Tailwind CSS", completed: false },
        { id: 4, title: "Learn GraphQL", completed: false },
        { id: 5, title: "Learn TypeScript", completed: false },
        { id: 6, title: "Learn Webpack", completed: false },
        { id: 7, title: "Learn Babel", completed: false },
    ]);

    const handleDragEnd = (event) => {
        const {active, over} = event;
        
        if (over) {
            if (over.id === 'completed-todos') {
                setTodos(todos.map(todo => 
                    todo.id === active.id ? {...todo, completed: true} : todo
                ));
            } else if (over.id === 'pending-todos') {
                setTodos(todos.map(todo => 
                    todo.id === active.id ? {...todo, completed: false} : todo
                ));
            }
        }
    };


    

    // const style = transform ? {
    //     transform: CSS.Transform.toString(transform),
    //     opacity: isDragging ? 0.7 : 1,
    //     background: isDragging ? "lightgreen" : "white",
    //     width: "100%",
    //     maxWidth: "300px",
    //     height: "40px",
    //     touchAction: "none"
    // } : undefined;

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
        
        <DndContext onDragEnd={handleDragEnd}>
        <Droppable id="pending-todos">
            <DashboardCard title="Pending Todos">
                <div className="todos-container">
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
                </div>
            </DashboardCard>
        </Droppable>

        <Droppable id="completed-todos">
            <DashboardCard title="Completed Todos">
                <div className="todos-container">
                    {todos.filter(todo => todo.completed).map((todo) => (
                        <TodoItem 
                            key={todo.id}
                            {...todo}
                            toggleTodo={toggleTodo}
                            deleteTodo={deleteTodo}
                        />
                    ))}
                </div>
            </DashboardCard>
        </Droppable>
    </DndContext>
    </>
    );
}