import { Upload, Lock, Database, Sparkles, UserCheck, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface FlowStep {
  icon: React.ElementType;
  number: number;
  title: string;
  description: string;
  details: string[];
}

const flowSteps: FlowStep[] = [
  {
    icon: Upload,
    number: 1,
    title: "you create",
    description: "your relationship journey begins with your input",
    details: [
      "complete your personal profile and questionnaire",
      "share your relationship goals and challenges",
      "upload optional profile photo to your secure storage",
      "all entries saved with your unique user id"
    ]
  },
  {
    icon: Lock,
    number: 2,
    title: "secure transit",
    description: "your data travels through encrypted channels",
    details: [
      "https/tls 1.2+ encryption for all data in motion",
      "no plaintext transmission - ever",
      "certificate pinning prevents man-in-the-middle attacks",
      "secure websocket connections for real-time features"
    ]
  },
  {
    icon: Database,
    number: 3,
    title: "protected storage",
    description: "data lands in a fortress designed for privacy",
    details: [
      "postgresql database with row-level security (rls)",
      "aes-256 encryption at rest for all stored data",
      "your data isolated from other users via rls policies",
      "automatic backups with same encryption standards"
    ]
  },
  {
    icon: Sparkles,
    number: 4,
    title: "ai processing",
    description: "intelligent coaching without compromising privacy",
    details: [
      "conversations routed through secure edge functions",
      "anthropic api receives context only, not personal identifiers",
      "ai responses generated based on conversation patterns",
      "no training on your data - your conversations stay yours"
    ]
  },
  {
    icon: UserCheck,
    number: 5,
    title: "you control",
    description: "ultimate power over your digital footprint",
    details: [
      "configure data retention (30/90/365 days or forever)",
      "delete conversations or entire account anytime",
      "export your data in standard formats",
      "privacy settings managed entirely by you"
    ]
  }
];

export const DataFlowCards = () => {
  return (
    <section className="px-6 pt-6 pb-12 lg:pt-8 lg:pb-16 bg-gradient-to-b from-burgundy-900 to-burgundy-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-brand text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-coral-400 via-coral-300 to-pink-300 bg-clip-text text-transparent">
            how your data flows
          </h2>
          <p className="text-xl text-coral-100/80 max-w-3xl mx-auto">
            from the moment you type to when it's stored or deleted
          </p>
        </div>

        {/* Flow Steps */}
        <div className="relative">
          {/* Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-coral-500/20 via-coral-400/40 to-coral-500/20" />
          
          {/* Wrapper for cards + CTA */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative flex-1">
              {flowSteps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Mobile Connecting Arrow */}
                  {index < flowSteps.length - 1 && (
                    <div className="lg:hidden absolute left-1/2 -bottom-4 transform -translate-x-1/2 translate-y-full">
                      <div className="w-0.5 h-8 bg-gradient-to-b from-coral-400/40 to-transparent" />
                    </div>
                  )}

                  <Card className="relative p-6 bg-gradient-to-br from-coral-500/10 to-pink-500/5 border-coral-500/30 hover:border-coral-400/50 transition-all duration-300 hover:scale-[1.05] h-full">
                    {/* Number Badge */}
                    <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-coral-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="mb-4 p-3 rounded-xl bg-coral-500/20 inline-block">
                      <step.icon className="w-8 h-8 text-coral-400" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 text-coral-50">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-coral-100/90 mb-4">
                      {step.description}
                    </p>

                    {/* Details */}
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="text-xs text-coral-200/80 flex items-start gap-2">
                          <span className="text-coral-400 mt-1">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              ))}
            </div>
            
            {/* CTA Buttons - visible on md+ */}
            <div className="hidden md:flex flex-col gap-4 justify-center lg:w-80">
              <Link to="/account?tab=security">
                <Button className="w-full bg-burgundy-600 text-white rounded-full text-lg px-8 py-6 hover:bg-burgundy-600">
                  <Settings className="w-5 h-5 mr-2" />
                  manage privacy settings
                </Button>
              </Link>
              <Link to="/">
                <Button className="w-full bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white rounded-full text-lg px-8 py-6">
                  get started free
                </Button>
              </Link>
            </div>
          </div>
          
          {/* CTA Buttons for mobile - centered below */}
          <div className="md:hidden flex flex-col gap-4 items-center mt-8">
            <Link to="/account?tab=security" className="w-full max-w-sm">
              <Button className="w-full bg-burgundy-600 text-white rounded-full text-lg px-8 py-6 hover:bg-burgundy-600">
                <Settings className="w-5 h-5 mr-2" />
                manage privacy settings
              </Button>
            </Link>
            <Link to="/" className="w-full max-w-sm">
              <Button className="w-full bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white rounded-full text-lg px-8 py-6">
                get started free
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
