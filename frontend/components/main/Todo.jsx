// Code: Todo component
import {
    Card
  } from "@/components/ui/card"
  
import TodoItem from "./TodoItem";
import Checkbox from "@/components/ui/checkbox";

var todos = [
    {
        id: 1,
        title: "Learn React",
        completed: true
    },
    {
        id: 2,
        title: "Learn Next.js",
        completed: false
    },
    {
        id: 3,
        title: "Learn Tailwind CSS",
        completed: false
    }
]

export default function Todo() {
    return (
        <Card className="todo">
            <h1>Todo List</h1>
        {todos.map((todo) => (  
            <>
            <TodoItem title={todo.title} completed={todo.completed} key={todo.id}/>
            </>
        ))}
       

      </Card>
      
    );

}
