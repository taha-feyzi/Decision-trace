import { Hero } from "@/components/landing/hero";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { Faq } from "@/components/landing/faq";

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <FeatureGrid />
      <Faq />
    </main>
  );
}
