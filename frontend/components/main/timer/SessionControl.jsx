import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Timer, Settings } from "lucide-react";

const SessionControl = ({ 
  workRunning, 
  breakTimerRunning, 
  workTime, 
  earnedBreakTime,
  onSessionEnd 
}) => {
  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-center gap-2 mt-1 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="flex-grow text-center md:text-left">
        <h3 className="text-xs font-medium flex items-center justify-center md:justify-start gap-1">
          <Timer className="h-3 w-3" /> Current Session
        </h3>
        <p className="text-xs text-slate-500 mb-2">
          {workRunning ? "Focus time in progress" : breakTimerRunning ? "Break time in progress" : "Session ready"}
        </p>
        
        {/* Always show session stats, even when a timer is running */}
        <div className="text-xs text-slate-500 mt-1">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {workTime > 0 && (
              <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                Work: {Math.floor(workTime / 60)}m {workTime % 60}s
              </span>
            )}
            {earnedBreakTime > 0 && (
              <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                Break earned: {Math.floor(earnedBreakTime / 60)}m {earnedBreakTime % 60}s
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-2 md:mt-0">
        <Button 
          variant="secondary" 
          onClick={onSessionEnd} 
          className="flex items-center gap-1"
          size="sm"
        >
          End Session
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 border-slate-300"
          onClick={() => toast.info("Settings", { description: "Timer settings coming soon!" })}
        >
          <Settings className="h-3 w-3" /> Settings
        </Button>
      </div>
    </div>
  );
};

// For standalone mode when no timer is visible or running
export const StandaloneSessionControl = ({
  workTime,
  earnedBreakTime,
  onSessionEnd
}) => {
  return (
    <div className="w-full rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm bg-card">
      <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-t-lg">
        <div className="flex items-center gap-2 font-medium">
          <span className="text-slate-500"><Timer className="h-4 w-4" /></span>
          Session
        </div>
      </div>
      <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex-grow text-center md:text-left">
          <p className="text-sm text-muted-foreground mb-2">No active timers</p>
          <div className="text-xs text-slate-500">
            {workTime > 0 && <p className="mb-1">Work time: {Math.floor(workTime / 60)}m {workTime % 60}s</p>}
            {earnedBreakTime > 0 && <p>Break time earned: {Math.floor(earnedBreakTime / 60)}m {earnedBreakTime % 60}s</p>}
            {!workTime && !earnedBreakTime && <p>Start a timer to track your work and breaks</p>}
          </div>
        </div>
        
        <div className="flex gap-2 mt-3 md:mt-0">
          <Button 
            variant="secondary" 
            onClick={onSessionEnd} 
            className="flex items-center gap-1"
            size="sm"
          >
            End Session
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1 border-slate-300"
            onClick={() => toast.info("Settings", { description: "Timer settings coming soon!" })}
          >
            <Settings className="h-3 w-3" /> Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionControl;