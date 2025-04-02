'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDashContext } from '@/provider/dashContext';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Play, Pause, RotateCcw, Clock, GripVertical } from 'lucide-react';

// Focus Timer Component
export function FocusTimer() {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const { setWorkTimerRunning } = useDashContext();
  const timerRef = useRef(null);
  
  // Format time as mm:ss
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate percentage for circular progress
  const getPercentage = () => {
    return ((25 * 60 - time) / (25 * 60)) * 100;
  };

  // Reset timer to initial state
  const resetTimer = () => {
    setTime(25 * 60);
    setIsRunning(false);
    setWorkTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Toggle timer between running and paused
  const toggleTimer = () => {
    setIsRunning(!isRunning);
    setWorkTimerRunning(!isRunning);
  };

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            // Timer finished
            setIsRunning(false);
            setWorkTimerRunning(false);
            clearInterval(timerRef.current);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, setWorkTimerRunning]);

  return (
    <Card className=" overflow-hidden">
      <CardHeader className="pb-2 bg-primary/5 card-header">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" /> Focus Timer
          </CardTitle>
          {/* Add drag handle */}
          <div className="card-header h-6 w-6 flex items-center justify-center rounded-sm hover:bg-muted/80">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <div className="w-40 h-40">
          <CircularProgressbar
            value={getPercentage()}
            text={formatTime(time)}
            styles={buildStyles({
              textSize: '16px',
              pathColor: `var(--primary)`,
              textColor: 'var(--foreground)',
              trailColor: 'var(--muted)',
            })}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-2 pt-0 pb-4">
        <Button variant="outline" size="sm" onClick={resetTimer}>
          <RotateCcw className="h-4 w-4" />
          <span className="ml-1">Reset</span>
        </Button>
        <Button onClick={toggleTimer}>
          {isRunning ? (
            <>
              <Pause className="h-4 w-4" />
              <span className="ml-1">Pause</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span className="ml-1">Start</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Break Timer Component
export function BreakTimer() {
  const [time, setTime] = useState(5 * 60); // 5 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const { setBreakTimerRunning } = useDashContext();
  const timerRef = useRef(null);
  
  // Format time as mm:ss
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate percentage for circular progress
  const getPercentage = () => {
    return ((5 * 60 - time) / (5 * 60)) * 100;
  };

  // Reset timer to initial state
  const resetTimer = () => {
    setTime(5 * 60);
    setIsRunning(false);
    setBreakTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Toggle timer between running and paused
  const toggleTimer = () => {
    setIsRunning(!isRunning);
    setBreakTimerRunning(!isRunning);
  };

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            // Timer finished
            setIsRunning(false);
            setBreakTimerRunning(false);
            clearInterval(timerRef.current);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, setBreakTimerRunning]);

  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader className="pb-2 bg-secondary/5 card-header">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" /> Break Timer
          </CardTitle>
          {/* Add drag handle */}
          <div className="card-header h-6 w-6 flex items-center justify-center rounded-sm hover:bg-muted/80">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <div className="w-40 h-40">
          <CircularProgressbar
            value={getPercentage()}
            text={formatTime(time)}
            styles={buildStyles({
              textSize: '16px',
              pathColor: `var(--secondary)`,
              textColor: 'var(--foreground)',
              trailColor: 'var(--muted)',
            })}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-2 pt-0 pb-4">
        <Button variant="outline" size="sm" onClick={resetTimer}>
          <RotateCcw className="h-4 w-4" />
          <span className="ml-1">Reset</span>
        </Button>
        <Button variant="secondary" onClick={toggleTimer}>
          {isRunning ? (
            <>
              <Pause className="h-4 w-4" />
              <span className="ml-1">Pause</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span className="ml-1">Start</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
