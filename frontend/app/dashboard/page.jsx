import CozyBackground from "@/components/background/CozyBackground";
import Todo from "@/components/main/Todo";

export default function dashboard() {
  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <CozyBackground />
      
      <div className="dashboard-content">
        Hello
        <Todo />
      </div>
    </div>
    
   
  );
}