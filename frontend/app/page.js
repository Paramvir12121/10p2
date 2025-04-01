'use client';

import Timer from "@/components/main/timer/DoubleTimer";
import AllTasks from "@/components/main/tasks/AllTasks";

export default function Home() {
  // Initial tasks data
  const initialTasks = [
    { id: '1', text: 'Complete project proposal', completed: false },
    { id: '2', text: 'Research competitor products', completed: false },
    { id: '3', text: 'Design user interface mockups', completed: false },
  ];

  return (
    <div className="container mx-auto px-3 py-6">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <AllTasks initialTasks={initialTasks} />
        </div>
        <div className="flex justify-end w-full md:w-auto mt-4 md:mt-0">
          <Timer />
        </div>
      </div>
    </div>
  );
}
