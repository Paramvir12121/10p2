'use client';
import {useState, useEffect} from "react";
import DashboardCard from "../custom/DashboardCard";

export default function Timer() {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);  
    

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
    }   , [running]);



    return (
        <>
            <DashboardCard title="Timer">
                <div className="flex justify-center items-center h-64">
                    <h1 className="text-4xl font-bold">00:00:00</h1>
                </div>
                <div className="flex justify-center">
                    <button className="btn btn-primary">Start</button>
                    <button className="btn btn-secondary">Stop</button>
                    <button className="btn btn-tertiary">Reset</button>
                </div>
            </DashboardCard>
        </>
    );
}