import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Timer, Settings, Clock, Coffee } from "lucide-react";

const SessionControl = ({ 
  workRunning, 
  breakTimerRunning, 
  workTime, 
  earnedBreakTime,
  onSessionEnd 
}) => {
  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-center gap-1 mt-1 bg-gradient-to-r from-slate-50/80 to-slate-100/80 dark:from-slate-900/80 dark:to-slate-800/80 p-1.5 rounded-sm border border-slate-200 dark:border-slate-800">
      <div className="flex-grow text-center md:text-left">
        <h3 className="text-[10px] font-medium flex items-center justify-center md:justify-start gap-1 text-slate-700 dark:text-slate-300">
          <Timer className="h-2.5 w-2.5 text-primary/70" /> Session Info
        </h3>
        
        <div className="text-[9px] text-slate-500 mt-0.5">
          <div className="flex flex-wrap gap-1 justify-center md:justify-start">
            {workTime > 0 && (
              <span className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded-sm inline-flex items-center">
                <Clock className="h-2 w-2 mr-0.5 text-primary/70" />
                {Math.floor(workTime / 60)}m {workTime % 60}s
              </span>
            )}
            {earnedBreakTime > 0 && (
              <span className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded-sm inline-flex items-center">
                <Coffee className="h-2 w-2 mr-0.5 text-green-500/70" />
                {Math.floor(earnedBreakTime / 60)}m
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex gap-1 mt-1 md:mt-0">
        <Button 
          variant="secondary" 
          onClick={onSessionEnd} 
          className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 h-5 rounded-sm"
          size="sm"
        >
          End Session
        </Button>
        {/* <Button 
          variant="outline" 
          size="sm"
          className="flex items-center w-5 h-5 p-0 border-slate-300 rounded-sm"
          onClick={() => toast.info("Settings", { description: "Timer settings coming soon!" })}
        >
          <Settings className="h-2.5 w-2.5" />
        </Button> */}
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