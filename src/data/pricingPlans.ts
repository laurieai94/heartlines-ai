import { Sprout, Zap, Radio, Sparkles, Heart, LucideIcon } from "lucide-react";

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  tagline: string;
  messages: number;
  icon: LucideIcon;
  features: string[];
  buttonText: string;
  popular: boolean;
  tier: 'freemium' | 'glow' | 'vibe' | 'unlimited';
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "begin",
    name: "begin",
    price: "$0",
    period: "month",
    description: "start small, spark awareness",
    tagline: "from first steps to stronger bonds",
    messages: 25,
    icon: Sprout,
    features: [
      "access to kai's evidence-based tools (cbt, eft, dbt)",
      "quick insights into your patterns + relationships",
      "try before you commit\" energy"
    ],
    buttonText: "start growing free",
    popular: false,
    tier: "freemium"
  },
  {
    id: "glow",
    name: "glow",
    price: "$19",
    period: "month",
    description: "your relationship's gym membership",
    tagline: "build momentum in your relationship",
    messages: 150,
    icon: Zap,
    features: [
      "coaching for self-reflection + relationships",
      "role play critical convos",
      "progress check-ins to track your growth"
    ],
    buttonText: "keep glowing",
    popular: false,
    tier: "glow"
  },
  {
    id: "vibe",
    name: "vibe",
    price: "$39",
    period: "month",
    description: "go all in for deeper love + growth",
    tagline: "turn insights into transformation",
    messages: 300,
    icon: Heart,
    features: [
      "unlimited scenarios (self-talk, dating, relationships)",
      "advanced insights + personal analytics",
      "custom goals for your growth journey"
    ],
    buttonText: "catch the vibe",
    popular: true,
    tier: "vibe"
  },
  {
    id: "unlimited",
    name: "unlimited",
    price: "$59",
    period: "month",
    description: "love without limits",
    tagline: "no limits on your journey",
    messages: 0,
    icon: Sparkles,
    features: [
      "unlimited messages per month",
      "all vibe features included",
      "priority support",
      "advanced ai capabilities"
    ],
    buttonText: "glow unlimited",
    popular: false,
    tier: "unlimited"
  }
];
