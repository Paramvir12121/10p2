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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-row items-start justify-between">
        <div className="space-y-6">
          {/* <h1 className="text-3xl font-bold mb-8">Focus Dashboard</h1> */}
          <AllTasks initialTasks={initialTasks} />
        </div>
        <div className="flex justify-end">
          <Timer />
        </div>
      </div>
    </div>
  );
}
