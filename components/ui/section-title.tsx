import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}

export function SectionTitle({ children, className }: SectionTitleProps) {
  return (
    <h3 className={cn("text-xs font-semibold uppercase tracking-wide text-text-secondary", className)}>
      {children}
    </h3>
  );
}
