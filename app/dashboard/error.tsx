"use client";

import { useEffect } from "react";
import { ErrorCard } from "@/components/analysis/error-card";
import { Button } from "@/components/ui/button";

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 p-6">
      <ErrorCard
        error={{
          code: "AI_INVALID_RESPONSE",
          title: "Something went wrong",
          description: "An unexpected error occurred while loading the dashboard."
        }}
      />
      <Button variant="secondary" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
