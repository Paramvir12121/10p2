'use client';
import CozyBackground from "@/components/background/CozyBackground";
import Todo from "@/components/main/Todo/Todo";
import Timer from "@/components/main/timer/Timer";
import { DndContext } from '@dnd-kit/core';

const timerSession = [{"time": 0, "breakTime": 0, "running": false}];

const addTimerSessioninfo = (time, breakTime, running) => {
  timerSession.push({"time": time, "breakTime": breakTime, "running": running});
}

const getTimerSessioninfo = () => {
  return timerSession;
}

const todoList = [
  { id: 1, title: "Learn React", completed: true },
  { id: 2, title: "Learn Next.js", completed: false },
  { id: 3, title: "Learn Tailwind CSS", completed: false },
  { id: 4, title: "Learn GraphQL", completed: false },
  { id: 5, title: "Learn TypeScript", completed: false },
  { id: 6, title: "Learn Webpack", completed: false },
  { id: 7, title: "Learn Babel", completed: false },
];






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