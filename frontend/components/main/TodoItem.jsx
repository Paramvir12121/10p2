import Checkbox from "@/components/ui/checkbox";

export default function TodoItem({ title, completed }) {
    return (
        <div className="todo-item">
           {/* <Checkbox checked={completed} /> */}
            <p>{title}</p>
        </div>
    );
}