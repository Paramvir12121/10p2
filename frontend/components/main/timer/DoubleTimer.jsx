'use client';
import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { toast } from "sonner";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Play, Pause, RefreshCcw, Clock, Coffee, ZapOff, ChevronDown, ChevronUp } from "lucide-react";
import { useDashContext } from "@/provider/dashContext";
import SessionControl, { StandaloneSessionControl } from "./SessionControl";

export default function DoubleTimer({ addTimerSessioninfo, getTimerSessioninfo }) {
  // Work timer states and general states
  const [workTime, setWorkTime] = useState(0);
  const [workRunning, setWorkRunning] = useState(false);
  const [workDisplayTime, setWorkDisplayTime] = useState("00:00");
  const [workCollapsed, setWorkCollapsed] = useState(false);
  
  // Break timer states
  const [breakTime, setBreakTime] = useState(0);
  const [breakTimerRunning, setBreakTimerRunning] = useState(false);
  const [breakDisplayTime, setBreakDisplayTime] = useState("00:00");
  const [breakCollapsed, setBreakCollapsed] = useState(false);
  
  // Session and progress tracking
  const [sessions, setSessions] = useState([]);
  const [workProgress, setWorkProgress] = useState(0);
  const [breakProgress, setBreakProgress] = useState(0);
  const [earnedBreakTime, setEarnedBreakTime] = useState(0);

  // Get context functions to synchronize timer state
  const { 
    setWorkTimerRunning: updateGlobalWorkTimerState, 
    setBreakTimerRunning: updateGlobalBreakTimerState,
    showWorkTimer, 
    showBreakTimer 
  } = useDashContext();

  // Sync timer state with context
  useEffect(() => {
    updateGlobalWorkTimerState(workRunning);
  }, [workRunning, updateGlobalWorkTimerState]);

  useEffect(() => {
    updateGlobalBreakTimerState(breakTimerRunning);
  }, [breakTimerRunning, updateGlobalBreakTimerState]);

  // Configuration
  const WORK_INTERVAL = 25 * 60; // 25 minutes in seconds
  const EARN_INTERVAL = 5 * 60; // Earn break time every 5 minutes
  const BREAK_REWARD = 60; // Earn 1 minute break for each EARN_INTERVAL

  // Visual state for animation
  const [showPulse, setShowPulse] = useState(false);

  // Pulse animation for active timers
  useEffect(() => {
    const interval = setInterval(() => {
      if (workRunning || breakTimerRunning) {
        setShowPulse(prev => !prev);
      } else {
        setShowPulse(false);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [workRunning, breakTimerRunning]);

  // Work timer logic
  useEffect(() => {
    let interval;
    if (workRunning) {
      interval = setInterval(() => {
        setWorkTime(prevTime => {
          const newTime = prevTime + 1;
          // Calculate work progress percentage
          setWorkProgress((newTime % WORK_INTERVAL) / WORK_INTERVAL * 100);
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [workRunning]);

  // Check for earned break time
  useEffect(() => {
    if (workRunning && workTime > 0 && workTime % EARN_INTERVAL === 0) {
      setEarnedBreakTime(prevTime => prevTime + BREAK_REWARD);
      
      toast.success("Break Time Earned!", {
        description: `You've earned ${BREAK_REWARD / 60} minute of break time.`,
        duration: 4000,
      });
    }
  }, [workTime, workRunning]);

  // Break timer logic
  useEffect(() => {
    let interval;
    if (breakTimerRunning) {
      interval = setInterval(() => {
        setBreakTime(prevTime => {
          if (prevTime <= 1) {
            handleBreakEnd();
            return 0;
          }
          // Calculate break progress (remaining)
          setBreakProgress(100 - ((prevTime - 1) / earnedBreakTime * 100));
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breakTimerRunning, earnedBreakTime]);

  // Format work time display
  useEffect(() => {
    const hours = Math.floor(workTime / 3600);
    const minutes = Math.floor((workTime % 3600) / 60);
    const seconds = workTime % 60;
    
    if (hours > 0) {
      setWorkDisplayTime(
        `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
      );
    } else {
      setWorkDisplayTime(
        `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
      );
    }
  }, [workTime]);

  // Format break time display
  useEffect(() => {
    const minutes = Math.floor(breakTime / 60);
    const seconds = breakTime % 60;
    
    setBreakDisplayTime(
      `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    );
  }, [breakTime]);

  // Timer control functions
  const handleWorkStart = () => {
    if (breakTimerRunning) {
      setBreakTimerRunning(false);
    }
    setWorkRunning(true);
  };
  
  const handleWorkStop = () => {
    setWorkRunning(false);
  };
  
  const handleWorkReset = () => {
    setWorkTime(0);
    setWorkRunning(false);
    setWorkProgress(0);
  };

  const handleBreakStart = () => {
    if (earnedBreakTime <= 0) {
      toast.error("No break time available", {
        description: "You need to work first to earn break time.",
        duration: 3000,
      });
      return;
    }
    
    if (workRunning) {
      setWorkRunning(false);
    }
    
    if (breakTime <= 0) {
      setBreakTime(earnedBreakTime);
      setBreakProgress(0);
    }
    
    setBreakTimerRunning(true);
  };
  
  const handleBreakStop = () => {
    setBreakTimerRunning(false);
  };
  
  const handleBreakEnd = () => {
    setBreakTimerRunning(false);
    setBreakTime(0);
    setEarnedBreakTime(0);
    setBreakProgress(0);
    
    toast.info("Break Ended", {
      description: "Your break has ended. Time to get back to work!",
      duration: 3000,
    });
  };

  // Session handling
  const handleSessionEnd = () => {
    const sessionData = { workTime, breakTime: earnedBreakTime, timestamp: new Date() };
    setSessions(prev => [...prev, sessionData]);
    
    setWorkRunning(false);
    setBreakTimerRunning(false);
    setWorkTime(0);
    setBreakTime(0);
    setEarnedBreakTime(0);
    setWorkProgress(0);
    setBreakProgress(0);
    
    if (addTimerSessioninfo) {
      addTimerSessioninfo(workTime, earnedBreakTime, false);
    }
    
    toast.success("Session Ended", {
      description: "Your session has been saved.",
      duration: 3000,
    });
  };

  // Custom card header component
  const CardHeader = ({ title, icon, collapsed, toggleCollapse }) => (
    <div 
      className="flex items-center justify-between p-1.5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-t-md cursor-pointer"
      onClick={toggleCollapse}
    >
      <div className="flex items-center gap-1 text-[11px] font-medium">
        {icon && <span className="text-primary/70">{icon}</span>}
        {title}
      </div>
      <Button variant="ghost" size="sm" className="w-5 h-5 p-0">
        {collapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
        <span className="sr-only">Toggle</span>
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-2 max-w-sm mx-auto">
      <div className="flex flex-col gap-2">
        {/* Work Timer - refined */}
        {showWorkTimer && (
          <div className="rounded-md border border-slate-200 dark:border-slate-800 shadow-sm bg-card">
            <CardHeader 
              title="Focus Timer" 
              icon={<Clock className="h-3 w-3" />} 
              collapsed={workCollapsed}
              toggleCollapse={() => setWorkCollapsed(!workCollapsed)}
            />
            
            {!workCollapsed && (
              <div className="flex items-center p-2 gap-2 relative">
                <div className="w-18 h-18 flex-shrink-0">
                  <CircularProgressbar 
                    value={workProgress}
                    text={workDisplayTime}
                    strokeWidth={5}
                    styles={buildStyles({
                      strokeLinecap: 'round',
                      textSize: '12px', // Slightly larger text
                      fontWeight: 'bold',
                      pathColor: workRunning ? `rgba(99, 102, 241, 1)` : '#6366f1',
                      textColor: workRunning ? '#6366f1' : '#64748b',
                      trailColor: '#f1f5f9',
                    })}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-1 mb-1">
                    <div className="flex justify-between text-[11px] font-medium">
                      <span className="text-slate-500">Session: {Math.floor(workTime / 60)}m {workTime % 60}s</span>
                      <span className="text-indigo-600/90 dark:text-indigo-400">Break: {Math.floor(earnedBreakTime / 60)}m</span>
                    </div>
                    
                    <div className="flex gap-1">
                      {workRunning ? (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="h-6 text-[11px] px-2 flex-1 rounded-sm"
                          onClick={handleWorkStop}
                        >
                          <Pause className="h-3 w-3 mr-1" /> Pause
                        </Button>
                      ) : (
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="bg-indigo-600 h-6 text-[11px] px-2 flex-1 rounded-sm"
                          onClick={handleWorkStart}
                        >
                          <Play className="h-3 w-3 mr-1" /> Start
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-6 w-6 p-0 rounded-sm"
                        onClick={handleWorkReset}
                      >
                        <RefreshCcw className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Break Timer - refined for consistency with work timer */}
        {showBreakTimer && (
          <div className="rounded-md border border-slate-200 dark:border-slate-800 shadow-sm bg-card">
            <CardHeader 
              title="Break Timer" 
              icon={<Coffee className="h-3 w-3" />} 
              collapsed={breakCollapsed}
              toggleCollapse={() => setBreakCollapsed(!breakCollapsed)}
            />
            
            {!breakCollapsed && (
              <div className="flex items-center p-2 gap-2 relative">
                <div className="w-18 h-18 flex-shrink-0">
                  <CircularProgressbar 
                    value={breakProgress}
                    text={breakTime > 0 ? breakDisplayTime : "00:00"}
                    strokeWidth={5}
                    counterClockwise
                    styles={buildStyles({
                      strokeLinecap: 'round',
                      textSize: '12px', // Slightly larger text
                      fontWeight: 'bold',
                      pathColor: breakTimerRunning ? `rgba(34, 197, 94, 1)` : '#22c55e',
                      textColor: breakTimerRunning ? '#22c55e' : '#64748b',
                      trailColor: '#f1f5f9',
                    })}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-1 mb-1">
                    <div className="flex justify-between text-[11px] font-medium">
                      <span className="text-slate-500">Available: {Math.floor(earnedBreakTime / 60)}m</span>
                      {breakTimerRunning && (
                        <span className="text-green-600/90 dark:text-green-400">Left: {Math.floor(breakTime / 60)}m {breakTime % 60}s</span>
                      )}
                    </div>
                    
                    <div className="flex gap-1">
                      {breakTimerRunning ? (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="h-6 text-[11px] px-2 flex-1 rounded-sm" 
                          onClick={handleBreakStop}
                        >
                          <Pause className="h-3 w-3 mr-1" /> Pause
                        </Button>
                      ) : (
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="bg-green-600 h-6 text-[11px] px-2 flex-1 rounded-sm"
                          onClick={handleBreakStart}
                          disabled={earnedBreakTime <= 0}
                        >
                          <Coffee className="h-3 w-3 mr-1" /> Break
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-6 w-6 p-0 rounded-sm"
                        onClick={handleBreakEnd}
                      >
                        <ZapOff className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Session Controls */}
      {(showWorkTimer || showBreakTimer) ? (
        <SessionControl
          workRunning={workRunning}
          breakTimerRunning={breakTimerRunning}
          workTime={workTime}
          earnedBreakTime={earnedBreakTime}
          onSessionEnd={handleSessionEnd}
        />
      ) : (
        <StandaloneSessionControl
          workTime={workTime}
          earnedBreakTime={earnedBreakTime}
          onSessionEnd={handleSessionEnd}
        />
      )}
    </div>
  );
}