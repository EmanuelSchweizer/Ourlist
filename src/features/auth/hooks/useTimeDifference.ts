import { useSyncExternalStore } from "react";

let nowMs = Date.now();
let intervalId: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

const emit = () => {
    nowMs = Date.now();
    listeners.forEach((listener) => listener());
};

const startTicker = () => {
    if (intervalId) {
        return;
    }
    intervalId = setInterval(emit, 1000);
};

const stopTicker = () => {
    if (!intervalId || listeners.size > 0) {
        return;
    }
    clearInterval(intervalId);
    intervalId = null;
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    startTicker();

    return () => {
        listeners.delete(listener);
        stopTicker();
    };
};

const getSnapshot = () => nowMs;

const toTimeAgo = (diffInSeconds: number) => {
    if (diffInSeconds < 60) {
        return "just now";
    }

    if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }

    if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
};

export const useTimeDifference = (timestamp: string) => {
    const currentNowMs = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
    const createdAtMs = new Date(timestamp).getTime();
    const diffInSeconds = Math.max(0, Math.floor((currentNowMs - createdAtMs) / 1000));
    const timeAgo = toTimeAgo(diffInSeconds);

    return { diffInSeconds, timeAgo };
}