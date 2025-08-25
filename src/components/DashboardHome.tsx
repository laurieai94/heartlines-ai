import { lazy, Suspense } from "react";
import BrandMark from "@/components/BrandMark";

const LandingPage = lazy(() => import("@/components/LandingPage"));

function DashboardHomeFallback() {
  return (
    <div className="min-h-screen bg-burgundy-900 flex items-center justify-center">
      <div className="text-center">
        <BrandMark size="lg" className="mx-auto" />
      </div>
    </div>
  );
}

export default function DashboardHome() {
  return (
    <Suspense fallback={<DashboardHomeFallback />}>
      <LandingPage showMarketingTopBar={false} />
    </Suspense>
  );
}
