import { Sprout, Heart, Flower, LucideIcon } from "lucide-react";

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
  tier: 'freemium' | 'grow' | 'thrive';
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "begin",
    name: "Begin",
    price: "$0",
    period: "month",
    description: "Start small, spark awareness",
    tagline: "From first steps to stronger bonds",
    messages: 50,
    icon: Sprout,
    features: [
      "Quick insights into your patterns + relationships",
      "Try before you commit\" energy"
    ],
    buttonText: "Get Started Free",
    popular: false,
    tier: "freemium"
  },
  {
    id: "grow",
    name: "Grow",
    price: "$15",
    period: "month",
    description: "Your relationship's gym membership",
    tagline: "Build momentum in your relationship",
    messages: 150,
    icon: Heart,
    features: [
      "Coaching for self-reflection + relationships",
      "Role play critical convos",
      "Progress check-ins to track your growth"
    ],
    buttonText: "Let's Grow",
    popular: true,
    tier: "grow"
  },
  {
    id: "thrive",
    name: "Thrive",
    price: "$29",
    period: "month",
    description: "Go all in for deeper love + growth",
    tagline: "Turn insights into transformation",
    messages: 300,
    icon: Flower,
    features: [
      "Unlimited scenarios (self-talk, dating, relationships)",
      "Advanced insights + personal analytics",
      "Custom goals for your growth journey"
    ],
    buttonText: "Go All In",
    popular: false,
    tier: "thrive"
  }
];
