import { FileSearch } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <FileSearch className="h-8 w-8 text-text-secondary" aria-hidden />
      <p className="text-sm text-text-secondary">Select a file to analyze.</p>
    </div>
  );
}
