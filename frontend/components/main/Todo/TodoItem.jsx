import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {Trash} from "lucide-react";

export default function TodoItem({ title, completed, id, toggleTodo,deleteTodo }) {
    return (
        <div className="todo-item">
            <div>
           <Checkbox checked={completed}
           onCheckedChange={() => toggleTodo(id)}   />
            {" "} {title}</div>
            <Trash onClick={() => deleteTodo(id)} size="sm"  className="h-4 w-4 delete-icon"/>
        </div>
    );
}