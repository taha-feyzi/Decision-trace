import { AlertTriangle } from "lucide-react";
import { AppError } from "@/types/analysis";
import { Card } from "@/components/ui/card";

export function ErrorCard({ error }: { error: AppError }) {
  return (
    <Card className="flex items-start gap-3 border-danger/30">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden />
      <div>
        <h3 className="text-sm font-medium text-white">{error.title}</h3>
        <p className="mt-1 text-sm text-text-secondary">{error.description}</p>
      </div>
    </Card>
  );
}
