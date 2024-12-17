import {Checkbox} from "@/components/ui/checkbox";
import {Trash} from "lucide-react";
import {useDraggable} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function TodoItem({ title, completed, id, toggleTodo, deleteTodo }) {
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: id,
        data: {
            type: 'todo',
            title,
            completed
        }
    });

    const handleCheckboxChange = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleTodo(id);
    };

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteTodo(id);
    };

    const style = transform ? {
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.7 : 1,
        background: isDragging ? "lightgreen" : "white",
        padding: "0.5rem",
        borderRadius: "0.5rem",
        cursor: "grab",
        touchAction: "none"
    } : undefined;

    return (
        <div 
            ref={setNodeRef} 
            style={style}
            className="todo-item"
        >
            <div {...attributes} {...listeners}>
                <div onClick={e => e.stopPropagation()}>
                    <Checkbox 
                        checked={completed}
                        onCheckedChange={handleCheckboxChange}
                    />
                    {" "}{title}
                </div>
            </div>
            <Trash 
                onClick={handleDelete}
                size="sm"
                className="h-4 w-4 delete-icon"
            />
        </div>
    );
}