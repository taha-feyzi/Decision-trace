import { HelpCircle, FileSearch, Gauge, RefreshCcw } from "lucide-react";
import { FeatureCard } from "@/components/landing/feature-card";

const FEATURES = [
  { icon: HelpCircle, title: "WHY", description: "Understand why files exist." },
  { icon: FileSearch, title: "Evidence", description: "See commits and repository history." },
  { icon: Gauge, title: "Confidence", description: "Know how reliable the analysis is." },
  { icon: RefreshCcw, title: "Still Valid", description: "Understand whether the engineering decision still makes sense today." }
];

export function FeatureGrid() {
  return (
    <section className="mx-auto grid max-w-4xl grid-cols-1 gap-4 px-6 py-20 sm:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map((feature) => (
        <FeatureCard key={feature.title} {...feature} />
      ))}
    </section>
  );
}
