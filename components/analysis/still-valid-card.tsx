import { StillValid } from "@/types/analysis";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";
import { Badge } from "@/components/ui/badge";

const STATUS_TONE: Record<StillValid["status"], "success" | "warning" | "danger"> = {
  Yes: "success",
  "Probably Yes": "success",
  "Probably No": "warning",
  No: "danger"
};

export function StillValidCard({ stillValid }: { stillValid: StillValid }) {
  return (
    <Card>
      <SectionTitle>Still Valid</SectionTitle>
      <div className="mt-3">
        <Badge tone={STATUS_TONE[stillValid.status]}>{stillValid.status}</Badge>
      </div>
      <p className="mt-2 text-sm text-text-secondary">{stillValid.reason}</p>
    </Card>
  );
}
