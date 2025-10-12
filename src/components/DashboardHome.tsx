import { lazy, Suspense } from "react";
import SplashScreen from "@/components/SplashScreen";

const LandingPage = lazy(() => import("@/components/LandingPage"));

function DashboardHomeFallback() {
  return <SplashScreen titleText="heartlines loading..." wordmarkSize="lg" />;
}

export default function DashboardHome() {
  return (
    <Suspense fallback={<DashboardHomeFallback />}>
      <LandingPage showMarketingTopBar={false} />
    </Suspense>
  );
}
