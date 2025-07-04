
import BackgroundEffects from "@/components/landing/BackgroundEffects";
import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import VisualBreak from "@/components/landing/VisualBreak";
import RealTalkSection from "@/components/landing/RealTalkSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import WhyDifferentSection from "@/components/landing/WhyDifferentSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import FloatingCTAButton from "@/components/landing/FloatingCTAButton";
import LandingFooter from "@/components/landing/LandingFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <BackgroundEffects />
      <LandingHeader />
      <HeroSection />
      <VisualBreak />
      <RealTalkSection />
      <HowItWorksSection />
      <WhyDifferentSection />
      <FinalCTASection />
      <FloatingCTAButton />
      <LandingFooter />
    </div>
  );
};

export default Index;
