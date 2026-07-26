"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEMO_REPOSITORY = "vercel/next.js";

export function RepositoryInput() {
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  function goToDashboard(repositoryUrl: string) {
    setIsSubmitting(true);
    router.push(`/dashboard?repo=${encodeURIComponent(repositoryUrl)}`);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!url.trim()) return;
    goToDashboard(url.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="https://github.com/owner/repository"
        aria-label="GitHub repository URL"
        className="flex-1 rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-white placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />
      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting} className="whitespace-nowrap">
          Analyze Repository
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
        <Button type="button" variant="secondary" onClick={() => goToDashboard(DEMO_REPOSITORY)} className="whitespace-nowrap">
          Try Demo
        </Button>
      </div>
    </form>
  );
}
