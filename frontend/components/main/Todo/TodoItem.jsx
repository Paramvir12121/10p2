import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {Trash} from "lucide-react";

export default function TodoItem({ title, completed, id, toggleTodo,deleteTodo }) {
    return (
        <div className="todo-item">
            <>
           <Checkbox checked={completed}
           onCheckedChange={() => toggleTodo(id)}   />
            {" "} {title}</>
            <Trash onClick={() => deleteTodo(id)} className="delete-todo"/>
        </div>
    );
}