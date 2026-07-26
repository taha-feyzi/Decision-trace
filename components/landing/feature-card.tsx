import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <Icon className="h-5 w-5 text-primary" aria-hidden />
      <h3 className="text-sm font-medium text-white">{title}</h3>
      <p className="text-sm text-text-secondary">{description}</p>
    </Card>
  );
}
