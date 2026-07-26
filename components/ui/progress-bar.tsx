import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
}

function toneForValue(value: number): string {
  if (value >= 80) return "bg-success";
  if (value >= 40) return "bg-warning";
  return "bg-danger";
}

export function ProgressBar({ value, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-border", className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={cn("h-full rounded-full transition-all", toneForValue(clamped))} style={{ width: `${clamped}%` }} />
    </div>
  );
}
