import {Checkbox} from "@/components/ui/checkbox";
import {Trash} from "lucide-react";
import {useDraggable} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';



export default function TodoItem({ title, completed, id, toggleTodo, deleteTodo }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        type: 'todo',
      });
    
      const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
      };
      
    
    return (
        <div  ref={setNodeRef} {...listeners} {...attributes} className="todo-item" style={style}>
            <div>
           <Checkbox checked={completed}
           onCheckedChange={() => toggleTodo(id)}   />
            {" "} {title}</div>
            <Trash onClick={() => deleteTodo(id)} size="sm"  className="h-4 w-4 delete-icon"/>
        </div>
    );
}