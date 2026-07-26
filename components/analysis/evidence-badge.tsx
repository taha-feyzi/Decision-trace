import { GitCommit, CircleDot, GitPullRequest, FolderTree, Blocks } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Evidence } from "@/types/evidence";
import { Badge } from "@/components/ui/badge";

const EVIDENCE_ICONS: Record<Evidence["type"], LucideIcon> = {
  Commit: GitCommit,
  Issue: CircleDot,
  "Pull Request": GitPullRequest,
  "Folder Structure": FolderTree,
  "Architecture Pattern": Blocks
};

export function EvidenceBadge({ evidence }: { evidence: Evidence }) {
  const Icon = EVIDENCE_ICONS[evidence.type];
  const content = (
    <Badge className="gap-1.5">
      <Icon className="h-3 w-3" aria-hidden />
      {evidence.title}
    </Badge>
  );

  if (!evidence.url) return content;

  return (
    <a href={evidence.url} target="_blank" rel="noreferrer" className="hover:opacity-80">
      {content}
    </a>
  );
}
