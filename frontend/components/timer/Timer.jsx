'use client';
import {useState, useEffect} from "react";
import DashboardCard from "../custom/DashboardCard";
import {Button} from "../ui/button";

export default function Timer() {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);  
    const [displayTime, setDisplayTime] = useState("00:00:00");

    

    useEffect(() => {
        let interval;
        if (running) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
                
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }   , [running, time]);


    const handleStart = () => {
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
        </>
    );
}