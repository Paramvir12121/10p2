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

  // Get timer visibility from context
  const { showWorkTimer, showBreakTimer } = useDashContext();
  
  // Custom card header component
  const CardHeader = ({ title, icon, collapsed, toggleCollapse }) => (
    <div 
      className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-t-lg cursor-pointer"
      onClick={toggleCollapse}
    >
      <div className="flex items-center gap-2 font-medium">
        {icon && <span className="text-slate-500">{icon}</span>}
        {title}
      </div>
      <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
        {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        <span className="sr-only">Toggle</span>
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto">
      {/* Stack timers vertically instead of in a grid */}
      <div className="flex flex-col gap-4">
        {/* Work Timer - always on top when visible */}
        {showWorkTimer && (
          <div className="flex flex-col gap-2">
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm bg-card">
              <CardHeader 
                title="Focus Timer" 
                icon={<Clock className="h-4 w-4" />} 
                collapsed={workCollapsed}
                toggleCollapse={() => setWorkCollapsed(!workCollapsed)}
              />
              
              {!workCollapsed && (
                <div className="flex flex-col items-center justify-center p-3 relative">
                  <div className="w-32 h-32 mb-3 relative">
                    {workRunning && (
                      <div className={`absolute inset-0 rounded-full bg-primary/5 ${showPulse ? 'scale-110' : 'scale-100'} transition-transform duration-1000 -z-10`}></div>
                    )}
                    <CircularProgressbar 
                      value={workProgress}
                      text={workDisplayTime}
                      strokeWidth={6}
                      styles={buildStyles({
                        strokeLinecap: 'round',
                        textSize: '14px',
                        fontWeight: 'bold',
                        pathColor: workRunning ? `rgba(99, 102, 241, ${showPulse ? '0.9' : '1'})` : '#6366f1',
                        textColor: workRunning ? '#6366f1' : '#64748b',
                        trailColor: '#f1f5f9',
                        pathTransition: 'stroke-dashoffset 0.5s ease',
                        backgroundColor: '#3e98c7',
                      })}
                    />
                    {workRunning && (
                      <div className="absolute top-3 left-3 right-3 bottom-3 rounded-full border-4 border-primary/20 -z-10"></div>
                    )}
                  </div>
                  
                  <div className="flex justify-center gap-2 mb-2">
                    {workRunning ? (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="flex items-center gap-1 shadow-md hover:shadow-lg transition-all" 
                        onClick={handleWorkStop}
                      >
                        <Pause className="h-4 w-4" /> Pause
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 shadow-md hover:shadow-lg transition-all" 
                        onClick={handleWorkStart}
                      >
                        <Play className="h-4 w-4" /> Start Focus
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 border-slate-300" 
                      onClick={handleWorkReset}
                    >
                      <RefreshCcw className="h-4 w-4" /> Reset
                    </Button>
                  </div>
                  
                  <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded-md w-full text-center">
                    <div className="font-medium mb-1">Target: 25 minutes</div>
                    <div className="flex justify-between items-center">
                      <span>Session time:</span>
                      <span className="font-mono">{Math.floor(workTime / 60)}m {workTime % 60}s</span>
                    </div>
                    <div className="flex justify-between items-center font-medium text-indigo-600 dark:text-indigo-400">
                      <span>Break time earned:</span>
                      <span className="font-mono">{Math.floor(earnedBreakTime / 60)}m {earnedBreakTime % 60}s</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Break Timer - always below work timer when visible */}
        {showBreakTimer && (
          <div className="flex flex-col gap-2">
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm bg-card">
              <CardHeader 
                title="Break Timer" 
                icon={<Coffee className="h-4 w-4" />} 
                collapsed={breakCollapsed}
                toggleCollapse={() => setBreakCollapsed(!breakCollapsed)}
              />
              
              {!breakCollapsed && (
                <div className="flex flex-col items-center justify-center p-3 relative">
                  <div className="w-32 h-32 mb-3 relative">
                    {breakTimerRunning && (
                      <div className={`absolute inset-0 rounded-full bg-green-500/5 ${showPulse ? 'scale-110' : 'scale-100'} transition-transform duration-1000 -z-10`}></div>
                    )}
                    <CircularProgressbar 
                      value={breakProgress}
                      text={breakTime > 0 ? breakDisplayTime : "00:00"}
                      strokeWidth={6}
                      counterClockwise
                      styles={buildStyles({
                        strokeLinecap: 'round',
                        textSize: '14px',
                        fontWeight: 'bold',
                        pathColor: breakTimerRunning ? `rgba(34, 197, 94, ${showPulse ? '0.9' : '1'})` : '#22c55e',
                        textColor: breakTimerRunning ? '#22c55e' : '#64748b',
                        trailColor: '#f1f5f9',
                        pathTransition: 'stroke-dashoffset 0.5s ease',
                      })}
                    />
                    {breakTimerRunning && (
                      <div className="absolute top-3 left-3 right-3 bottom-3 rounded-full border-4 border-green-500/20 -z-10"></div>
                    )}
                  </div>
                  
                  <div className="flex justify-center gap-2 mb-2">
                    {breakTimerRunning ? (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="flex items-center gap-1 shadow-md hover:shadow-lg transition-all" 
                        onClick={handleBreakStop}
                      >
                        <Pause className="h-4 w-4" /> Pause
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className={`bg-green-600 hover:bg-green-700 text-white flex items-center gap-1 shadow-md hover:shadow-lg transition-all ${earnedBreakTime <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleBreakStart}
                        disabled={earnedBreakTime <= 0}
                      >
                        <Coffee className="h-4 w-4" /> Take Break
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 border-slate-300" 
                      onClick={handleBreakEnd}
                    >
                      <ZapOff className="h-4 w-4" /> Skip
                    </Button>
                  </div>
                  
                  <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded-md w-full">
                    <div className="font-medium text-center mb-1">Your Break Stats</div>
                    <div className="flex justify-between items-center">
                      <span>Available break time:</span>
                      <span className="font-mono">{Math.floor(earnedBreakTime / 60)}m {earnedBreakTime % 60}s</span>
                    </div>
                    {breakTimerRunning ? (
                      <div className="flex justify-between items-center font-medium text-green-600 dark:text-green-400">
                        <span>Time remaining:</span>
                        <span className="font-mono">{Math.floor(breakTime / 60)}m {breakTime % 60}s</span>
                      </div>
                    ) : (
                      <div className="text-center mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                        {earnedBreakTime <= 0 ? "Focus first to earn break time" : "Ready for a break?"}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Session Controls - Always at the bottom and full width */}
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