import CozyBackground from "@/components/background/CozyBackground";
import Todo from "@/components/main/Todo/Todo";
import Timer from "@/components/timer/Timer";

export default function dashboard() {
  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <CozyBackground />   
      <div className="dashboard-content">
        <div className="left-row">
        <Todo />
        </div>
        <div className="right-row">
        <Timer />
        </div>
      </div>
    </div>
    
   
  );
}