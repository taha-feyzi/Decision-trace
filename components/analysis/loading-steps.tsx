"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { LOADING_STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STEP_INTERVAL_MS = 900;

export function LoadingSteps() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= LOADING_STEPS.length - 1) return;
    const timer = setTimeout(() => setActiveIndex((prev) => prev + 1), STEP_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  return (
    <div className="flex flex-col gap-3">
      {LOADING_STEPS.map((step, index) => {
        const isComplete = index < activeIndex;
        const isActive = index === activeIndex;

        return (
          <div key={step} className={cn("flex items-center gap-3 text-sm", isComplete || isActive ? "text-white" : "text-text-secondary")}>
            {isComplete ? (
              <Check className="h-4 w-4 shrink-0 text-success" aria-hidden />
            ) : isActive ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" aria-hidden />
            ) : (
              <span className="h-4 w-4 shrink-0 rounded-full border border-border" aria-hidden />
            )}
            {step}
          </div>
        );
      })}
    </div>
  );
}
