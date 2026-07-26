import { FileAnalysis } from "@/types/analysis";
import { WhyCard } from "@/components/analysis/why-card";
import { EvidenceCard } from "@/components/analysis/evidence-card";
import { ConfidenceCard } from "@/components/analysis/confidence-card";
import { StillValidCard } from "@/components/analysis/still-valid-card";

export function AnalysisPanel({ analysis }: { analysis: FileAnalysis }) {
  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div>
        <h2 className="text-sm font-medium text-white">{analysis.filePath.split("/").pop()}</h2>
        <p className="text-xs text-text-secondary">{analysis.filePath}</p>
      </div>
      <WhyCard why={analysis.why} />
      <EvidenceCard evidence={analysis.evidence} />
      <ConfidenceCard confidence={analysis.confidence} />
      <StillValidCard stillValid={analysis.stillValid} />
    </div>
  );
}
