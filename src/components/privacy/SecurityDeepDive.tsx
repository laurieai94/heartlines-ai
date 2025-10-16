import { Shield, Lock, Database, Server, Eye, Key, HardDrive, Clock, Image } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SecurityFeature {
  icon: React.ElementType;
  name: string;
  technical: string;
  meaning: string;
}

const securityFeatures: SecurityFeature[] = [
  {
    icon: Shield,
    name: "row-level security (rls)",
    technical: "PostgreSQL RLS policies enforced on all tables. Database queries automatically filtered by auth.uid() = user_id.",
    meaning: "even if someone hacked into our database, they could only see their own data. the database itself enforces this - it's not just app code that can be bypassed."
  },
  {
    icon: Lock,
    name: "encrypted transport (https/tls)",
    technical: "TLS 1.2+ encryption for all data transmission. Supabase enforces HTTPS for all API calls with certificate pinning.",
    meaning: "your conversations can't be intercepted while traveling between your device and our servers - like sending a sealed letter instead of a postcard."
  },
  {
    icon: HardDrive,
    name: "encryption at rest",
    technical: "Supabase provides AES-256 encryption for all stored data in PostgreSQL. Encryption keys managed separately from data.",
    meaning: "even if someone stole the physical hard drives, your data would be unreadable gibberish without the encryption keys that are stored separately."
  },
  {
    icon: Server,
    name: "secure edge functions",
    technical: "API keys stored server-side in Supabase Edge Functions environment variables. Never exposed to client browser or network requests.",
    meaning: "your browser never sees the 'keys to the kingdom' - sensitive credentials stay on secure servers, not in your browser's memory where malicious scripts could access them."
  },
  {
    icon: Eye,
    name: "zero-knowledge architecture",
    technical: "Anthropic API calls routed through Edge Functions with conversation context only. No PII (personally identifiable information) sent to AI models.",
    meaning: "the AI coach receives your conversation content but not your name, email, or other identifying information. it knows what you're saying, not who you are."
  },
  {
    icon: Key,
    name: "authentication security",
    technical: "Supabase Auth with JWT tokens, bcrypt password hashing (cost factor 10), automatic session rotation and refresh token management.",
    meaning: "your password is never stored - only a mathematical fingerprint that can verify but not reveal it. even we can't see your actual password."
  },
  {
    icon: Database,
    name: "isolated data storage",
    technical: "Each user's data logically isolated via RLS policies. Multi-tenant architecture with user_id foreign keys and CASCADE delete constraints.",
    meaning: "your data is in its own secure compartment. when you delete your account, everything associated with it is automatically removed from our systems."
  },
  {
    icon: Clock,
    name: "user-controlled retention",
    technical: "Configurable retention policies (30/90/365 days or forever) stored in privacy settings. Automated cleanup jobs respect user preferences.",
    meaning: "you decide how long we keep your conversations - set it to 30 days and we automatically delete older chats. you're in control of your digital footprint."
  },
  {
    icon: Image,
    name: "secure file storage",
    technical: "Supabase Storage with RLS policies on storage.objects table. Users can only upload/view files where user_id matches auth.uid().",
    meaning: "your profile picture is locked to your account - no one else can replace it or access it without your permission. same for any files you upload."
  }
];

export const SecurityDeepDive = () => {
  return (
    <section className="relative px-6 py-16 lg:py-24 bg-gradient-to-b from-burgundy-950 via-burgundy-900 to-burgundy-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-brand text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-coral-400 via-coral-300 to-pink-300 bg-clip-text text-transparent">
            security built into every layer
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            we don't just talk about privacy. here's exactly how we protect you.
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityFeatures.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 bg-burgundy-800/50 border-coral-500/20 hover:border-coral-400/40 transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Icon & Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-coral-500/10">
                  <feature.icon className="w-6 h-6 text-coral-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {feature.name}
                </h3>
              </div>

              {/* Technical Description */}
              <div className="mb-4">
                <div className="text-xs font-mono text-coral-300 mb-2 uppercase tracking-wider">
                  technical
                </div>
                <p className="text-sm text-coral-200/90 font-mono leading-relaxed">
                  {feature.technical}
                </p>
              </div>

              {/* Plain English */}
              <div>
                <div className="text-xs font-mono text-pink-300 mb-2 uppercase tracking-wider">
                  what this means
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {feature.meaning}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Context */}
        <div className="mt-16 text-center">
          <Card className="inline-block p-6 bg-burgundy-800/30 border-coral-500/20">
            <p className="text-sm text-muted-foreground max-w-2xl">
              <span className="font-semibold text-coral-400">transparency matters:</span> we're honest about our limitations too. heartlines is not HIPAA compliant and should not be used for medical advice. 
              for security concerns, contact us at <span className="text-coral-300">security@heartlines.app</span>
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};
