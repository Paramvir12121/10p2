'use client';

import Image from "next/image";
import Timer from "@/components/main/timer/DoubleTimer";
import Tasks from "@/components/main/tasks/Tasks";
import MainTask from "@/components/main/tasks/MainTask";
import { useState, useEffect } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([
    { id: '1', text: 'Complete project proposal', completed: false },
    { id: '2', text: 'Research competitor products', completed: false },
    { id: '3', text: 'Design user interface mockups', completed: false },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-row items-start justify-between">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold mb-8">Focus Dashboard</h1>
          <div className="flex flex-col space-y-6">
            <MainTask tasks={tasks} />
            <Tasks />
          </div>
        </div>
        <div className="flex justify-end">
          <Timer />
        </div>
      </div>
    </div>
  );
}
