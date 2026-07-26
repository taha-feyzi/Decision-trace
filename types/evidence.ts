export type EvidenceType = "Commit" | "Issue" | "Pull Request" | "Folder Structure" | "Architecture Pattern";

export interface Evidence {
  type: EvidenceType;
  title: string;
  url?: string;
}
