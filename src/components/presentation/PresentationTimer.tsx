import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface PresentationTimerProps {
  className?: string;
  compact?: boolean;
}

export function PresentationTimer({ className, compact = false }: PresentationTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const toggle = useCallback(() => {
    setIsRunning((r) => !r);
  }, []);

  const reset = useCallback(() => {
    setSeconds(0);
    setIsRunning(false);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (compact) {
    return (
      <button
        onClick={toggle}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-foreground/10 bg-background/80 backdrop-blur font-sans-ui text-sm cursor-pointer select-none transition-all hover:bg-foreground hover:text-background",
          isRunning && "border-primary text-primary",
          className
        )}
      >
        <Timer className="h-4 w-4" />
        <span className="font-mono">{formatTime(seconds)}</span>
      </button>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-foreground/10 bg-background/80 backdrop-blur font-sans-ui text-sm",
          isRunning && "border-primary text-primary"
        )}
      >
        <Timer className="h-4 w-4" />
        <span className="font-mono">{formatTime(seconds)}</span>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-xl"
        onClick={toggle}
      >
        {isRunning ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-xl"
        onClick={reset}
        disabled={seconds === 0}
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
