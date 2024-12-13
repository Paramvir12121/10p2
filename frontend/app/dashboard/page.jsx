import CozyBackground from "@/components/background/CozyBackground";
import Todo from "@/components/main/Todo/Todo";
import Timer from "@/components/main/timer/Timer";

const timerSession = [{"time": 0, "breakTime": 0, "running": false}];

const addTimerSessioninfo = (time, breakTime, running) => {
  timerSession.push({"time": time, "breakTime": breakTime, "running": running});
}

const getTimerSessioninfo = () => {
  return timerSession;
}


export default function dashboard() {

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <CozyBackground />   
      <div className="dashboard-content">
      <div className="grid-container">
        <div className="left-column">
        <Todo  addTimerSessioninfo={addTimerSessioninfo} getTimerSessioninfo={getTimerSessioninfo}/>
        </div>
        <div className="right-column">
        <Timer addTimerSessioninfo={addTimerSessioninfo} getTimerSessioninfo={getTimerSessioninfo} />
        </div>
      </div>
      </div>
    </div>
       
  );
}