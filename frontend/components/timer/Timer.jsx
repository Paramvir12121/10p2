'use client';
import {useState, useRef, useEffect} from "react";
import DashboardCard from "../custom/DashboardCard";
import {Button} from "../ui/button";

export default function Timer() {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);  
    const [displayTime, setDisplayTime] = useState("00:00:00");
    const [breakTime, setBreakTime] = useState(false);
    const [breakTimerRunning, setBreakTimerRunning] = useState(false);
    const [breakDisplayTime, setBreakDisplayTime] = useState("00:00");

    const accumulatedBreakTime = useRef(0);


    

    useEffect(() => {
        let interval;
        if (running) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 60);
                
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }   , [running, time]);


    const handleStart = () => {
        setBreakTimerRunning(false);
        setRunning(true);
    }
    const handleStop = () => {
        setRunning(false);
    }
    const handleReset = () => {
        setTime(0);
        setRunning(false);
    }

    useEffect(() => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        if (time > 3600){
        setDisplayTime(
            `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
        )} else {
            setDisplayTime(
                `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
            )
        }
    }   
    , [time]);

    // Break Timer
    useEffect(() => {
        if (time > 0 && time % 300 === 0) {
            let breakTimePlaceholder = 0;
            
            accumulatedBreakTime.current += 60;
            breakTimePlaceholder += accumulatedBreakTime.current;
            
            setBreakTime(breakTimePlaceholder);
            console.log(breakTime)
        }
    }, [time]);

    useEffect(() => {
        let interval;
        if (breakTimerRunning) {
            interval = setInterval(() => {
                
                setBreakTime((prevTime) => prevTime - 1);
                console.log(breakTime);
                
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }
    , [breakTimerRunning, breakTime]);

    useEffect(() => {
        // const hours = Math.floor(breakTime / 3600);
        const minutes = Math.floor((breakTime % 3600) / 60);
        const seconds = breakTime % 60;
       
        setBreakDisplayTime(
            `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`

        )
    }   
    , [breakTime]);



    const handleBreakStart = () => {
        setBreakTimerRunning(true);
    }
    const handleBreakStop = () => {
        setBreakTimerRunning(false);
    }
    const handleBreakEnd = () => {
        setBreakTime(0);
        setBreakTimerRunning(false);
    }


    return (
        <>
            <DashboardCard title="Timer">
                <div className="flex justify-center items-center h-32">
                    <h1 className="text-4xl font-bold">{displayTime}</h1>
                </div>
                <div className="flex justify-center">
                    <Button className="btn btn-primary" onClick={handleStart}>Start</Button>
                    <Button className="btn btn-secondary" onClick={handleStop}>Stop</Button>
                    <Button className="btn btn-tertiary" onClick={handleReset}>Reset</Button>
                </div>
            </DashboardCard>
            <DashboardCard title="Break Timer">
                <div className="flex justify-center items-center h-32">
                    <h1 className="text-4xl font-bold">{breakDisplayTime}</h1>
                </div>
                <div className="flex justify-center">
                    <Button className="btn btn-primary" onClick={handleBreakStart}>Start</Button>
                    <Button className="btn btn-secondary" onClick={handleBreakStop}>Stop</Button>
                    <Button className="btn btn-tertiary" onClick={handleBreakEnd}>End</Button>
                </div>
            </DashboardCard>
        </>
    );
}