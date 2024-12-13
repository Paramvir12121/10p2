import CozyBackground from "@/components/background/CozyBackground";
import Todo from "@/components/main/Todo/Todo";
import Timer from "@/components/main/timer/Timer";

const session = [{"time": 0, "breakTime": 0, "running": false}];

export default function dashboard() {

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <CozyBackground />   
      <div className="dashboard-content">
      <div className="grid-container">
        <div className="left-column">
        <Todo />
        </div>
        <div className="right-column">
        <Timer />
        </div>
      </div>
      </div>
    </div>
       
  );
}