'use client';
import CozyBackground from "@/components/background/CozyBackground";
import Todo from "@/components/main/Todo/Todo";
import Timer from "@/components/main/timer/Timer";
import { DndContext } from '@dnd-kit/core';

const timerSession = [{"time": 0, "breakTime": 0, "running": false}];

const handleDragEnd = (event) => {
  const {active, over} = event;
  if (over && over.id === 'timer') {
    // Handle drop into timer
    console.log('Dropped todo into timer:', active.id);
  }
};

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
        <Todo  addTimerSessioninfo={addTimerSessioninfo}  getTimerSessioninfo={getTimerSessioninfo}/>
        </div>
        <div className="right-column">
        <Timer addTimerSessioninfo={addTimerSessioninfo} getTimerSessioninfo={getTimerSessioninfo} />
        </div>
      
      </div>
     
      </div>
    </div>
   

       
  );
}