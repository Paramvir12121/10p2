'use client';

import { Card } from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button"; 
import TodoItem from "./TodoItem";
import { useState } from "react";

export default function Todo() {
    const [todos, setTodos] = useState([
        { id: 1, title: "Learn React", completed: true },
        { id: 2, title: "Learn Next.js", completed: false },
        { id: 3, title: "Learn Tailwind CSS", completed: false },
        { id: 4, title: "Learn GraphQL", completed: false },
        { id: 5, title: "Learn TypeScript", completed: false },
    ]);

    const [newTodo, setNewTodo] = useState("");

    const handleAddTodo = () => {
        if (!newTodo) return;
        setTodos([...todos, { id: todos.length + 1, title: newTodo, completed: false }]);
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    }


    return (
        <>
        <Card className="todo">
            <h1>Todo List</h1>
            {todos.filter(todo => !todo.completed).map((todo) => (
               
                <TodoItem title={todo.title} toggleTodo={toggleTodo}  id={todo.id} completed={todo.completed} key={todo.id} />
              
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
        </Card>
        <br />
        <Card className="todo">
            <h1>Completed Todos</h1>
            {todos.filter(todo => todo.completed).map((todo) => (
                <TodoItem title={todo.title} toggleTodo={toggleTodo} id={todo.id} completed={todo.completed} key={todo.id} />
            ))}
        </Card>
        </> 
    );
}