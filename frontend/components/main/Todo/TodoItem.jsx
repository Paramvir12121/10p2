import {Checkbox} from "@/components/ui/checkbox";
import {Trash} from "lucide-react";
import {useDraggable} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {Card} from "@/components/ui/card";



export default function TodoItem({ title, completed, id, toggleTodo, deleteTodo }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id
    });
    
    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.7 : 1,
        background: isDragging ? "lightgreen" : "white",
        padding: isDragging ? "0.2rem" : "0rem",
        border: isDragging ? "1px solid lightgreen" : "none",
        borderRadius: "0.5rem",
        
    };
    
    return (
        <div ref={setNodeRef} {...listeners} {...attributes} className="todo-item" style={style}>
            <div onClick={(e) => e.stopPropagation()}>
                <Checkbox 
                    checked={completed}
                    onCheckedChange={() => toggleTodo(id)}
                />
                {" "} {title}
            </div>
            <Trash 
                onClick={(e) => {
                    e.stopPropagation();
                    deleteTodo(id);
                }}
                size="sm"
                className="h-4 w-4 delete-icon"
            />
        </div>
    );
}