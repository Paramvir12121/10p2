import {Checkbox} from "@/components/ui/checkbox";

export default function TodoItem({ title, completed, id, toggleTodo }) {
    return (
        <div className="todo-item">
           <Checkbox 
           onCheckedChange={() => toggleTodo(id)}   />
            {title}
        </div>
    );
}