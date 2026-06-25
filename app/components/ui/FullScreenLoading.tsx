"use client";

import {useEffect, useState} from "react";
import Image from "next/image";

const loadingPhrases = [
    "Analyzing tannic structure...",
    "Searching the cellar for your match...",
    "Balancing flavor profiles...",
    "Consulting our virtual sommelier...",
    "Cross-referencing terroir and taste...",
    "Refining your perfect pairing...",
    "Decanting the possibilities...",
    "Calibrating the palate...",
    "Weighing notes of oak and fruit...",
    "Exploring bold and classic pairings...",
    "Synthesizing the ideal match...",
    "Finishing touches on your pairing...",
    "Tasting through the options...",
    "Curating your perfect glass...",
];

function getRandomPhrase(exclude: string | null = null) {
    const pool = exclude
        ? loadingPhrases.filter((p) => p !== exclude)
        : loadingPhrases;
    return pool[Math.floor(Math.random() * pool.length)];
}

export default function FullScreenLoading({ force = false, minDuration = 3750 }: { force?: boolean; minDuration?: number }) {
    const [phrase, setPhrase] = useState(getRandomPhrase());
    const [timerDone, setTimerDone] = useState(false);
    const [exiting, setExiting] = useState(false);
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setPhrase((prev) => getRandomPhrase(prev));
        }, 1400);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setTimerDone(true), minDuration);
        return () => clearTimeout(timer);
    }, [minDuration]);

    useEffect(() => {
        if (timerDone && !force) {
            setExiting(true);
            const out = setTimeout(() => setHidden(true), 700);
            return () => clearTimeout(out);
        }
    }, [timerDone, force]);

    if (hidden) return null;

    return (
        <div className={`fixed z-50 bg-bg left-0 top-0 w-full h-screen overflow-hidden flex flex-col justify-center items-center gap-4 transition-transform duration-700 ease-in-out ${exiting ? "translate-y-full" : "translate-y-0"}`}>
            <Image src={"/winecore.svg"} alt="WineCore" width={133} height={25} className="p-3 bg-bordeaux-deep rounded-3xl" />
            <div className="glass">
                <div className="glass-bowl"><div className="glass-wine" /></div>
                <div className="glass-stem" /><div className="glass-base" />
            </div>
            <p className="text-bordeaux text-lg">{phrase}</p>
        </div>
    );
}
