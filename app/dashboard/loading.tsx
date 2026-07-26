import { LoadingSteps } from "@/components/analysis/loading-steps";

export default function DashboardLoading() {
  return (
    <div className="flex h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <LoadingSteps />
      </div>
    </div>
  );
}
