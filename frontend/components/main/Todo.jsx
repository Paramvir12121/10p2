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
        { id: 3, title: "Learn Tailwind CSS", completed: false }
    ]);

    const [newTodo, setNewTodo] = useState("");

    const handleAddTodo = () => {
        if (!newTodo) return;
        setTodos([...todos, { id: todos.length + 1, title: newTodo, completed: false }]);
        setNewTodo("");
    };

    const toggleTodo = (id) => {
        console.log("before",id, todos[id].completed);
        setTodos(todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
        console.log("after",id, todos[id].completed);
    };


    return (
        <Card className="todo">
            <h1>Todo List</h1>
            {todos.map((todo) => (
                <>
                <TodoItem title={todo.title} toggleTodo={toggleTodo}  id={todo.id} completed={todo.completed} key={todo.id} />
                </>
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
    );
}