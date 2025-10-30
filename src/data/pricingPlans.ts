import { Sprout, Zap, Radio, Infinity, Heart, LucideIcon } from "lucide-react";

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
      "kai's science-backed tools",
      "dating + relationship insights",
      "1 partner profile",
      "\"try before you commit\" vibes"
    ],
    buttonText: "start free",
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
      "everything in begin",
      "2 partner profiles (track both sides)",
      "deeper self-reflection + coaching",
      "role-play tough convos"
    ],
    buttonText: "keep glowing",
    popular: false,
    tier: "glow"
  },
  {
    id: "vibe",
    name: "vibe",
    price: "$29",
    period: "month",
    description: "dive deeper into connection",
    tagline: "turn insights into transformation",
    messages: 300,
    icon: Heart,
    features: [
      "everything in glow",
      "6 partner profiles",
      "growth check-ins",
      "advanced insights"
    ],
    buttonText: "catch the vibe",
    popular: true,
    tier: "vibe"
  },
  {
    id: "unlimited",
    name: "unlimited",
    price: "$49",
    period: "month",
    description: "love without limits",
    tagline: "no limits on your journey",
    messages: 0,
    icon: Infinity,
    features: [
      "everything in vibe",
      "unlimited partner profiles",
      "talk anytime, as much as you need",
      "priority support when it matters most"
    ],
    buttonText: "glow unlimited",
    popular: false,
    tier: "unlimited"
  }
];
