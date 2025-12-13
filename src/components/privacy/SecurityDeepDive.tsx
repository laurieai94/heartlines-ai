import { memo } from "react";
import { Shield, Lock, Server, Eye, Key, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SecurityFeature {
  icon: React.ElementType;
  name: string;
  technical: string;
  meaning: string;
}

const securityFeatures: SecurityFeature[] = [
  {
    icon: Clock,
    name: "user-controlled retention & data export",
    technical: "configurable retention policies (30, 90, 365 days or forever). full data export available anytime in json format. supabase storage protected by rls so files are accessible only when user_id = auth.uid().",
    meaning: "you decide how long we keep your conversations. export all your data anytime. your uploaded files, like profile pictures, stay locked to your account alone."
  },
  {
    icon: Eye,
    name: "zero-knowledge architecture",
    technical: "anthropic api calls are routed through edge functions with only conversation context. no personally identifiable information (pii) is ever sent.",
    meaning: "kai, the ai coach, knows what you say but not who you are. your identity stays separate from your conversations."
  },
  {
    icon: Key,
    name: "authentication security",
    technical: "supabase auth with jwt tokens, bcrypt password hashing (cost factor 10), automatic session rotation, and refresh token management.",
    meaning: "your password is never stored. only a mathematical fingerprint is saved, which can verify but not reveal it."
  },
  {
    icon: Shield,
    name: "row-level security (rls) & isolated storage",
    technical: "postgresql rls policies enforced on all tables, tied to auth.uid(). each user's data is logically isolated with foreign keys and cascade delete constraints.",
    meaning: "your data lives in its own locked compartment. if someone hacked into our database, they would only see their own info. when you delete your account, everything tied to you is automatically wiped."
  },
  {
    icon: Lock,
    name: "encrypted transport & storage",
    technical: "tls 1.2+ encryption for all data in transit with certificate pinning. aes-256 encryption at rest for all stored data, with keys managed separately.",
    meaning: "your conversations travel like sealed letters instead of postcards. if someone stole the hard drives, they would find only unreadable gibberish."
  },
  {
    icon: Server,
    name: "secure edge functions",
    technical: "api keys stored server-side in supabase edge functions environment variables, never exposed to the browser or network requests.",
    meaning: "your device never sees the keys to the kingdom. sensitive credentials stay locked on secure servers, away from malicious scripts."
  }
];

export const SecurityDeepDive = memo(() => {
  return (
    <section className="relative px-6 pt-4 lg:pt-6 pb-8 lg:pb-12 bg-gradient-to-b from-burgundy-950 via-burgundy-900 to-burgundy-900">
      <div className="max-w-7xl mx-auto">

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityFeatures.map((feature, index) => (
            <Card 
              key={index}
              className="p-8 bg-burgundy-800/50 border-coral-500/20 hover:border-coral-400/40 transition-all duration-300 hover:scale-[1.01] shadow-lg hover:shadow-2xl hover:shadow-coral-500/10"
            >
              {/* Icon & Name */}
              <div className="flex items-start gap-3 mb-6 min-h-[80px]">
                <div className="p-2.5 rounded-lg bg-coral-500/10">
                  <feature.icon className="w-6 h-6 text-coral-400" />
                </div>
                <h3 className="text-lg font-medium text-coral-50 tracking-wide">
                  {feature.name}
                </h3>
              </div>

              {/* Technical Description */}
              <div className="mb-6">
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
                <p className="text-sm text-coral-50/90 leading-relaxed font-light">
                  {feature.meaning}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Context */}
        <div className="mt-16 text-center">
          <Card className="inline-block p-6 bg-burgundy-800/30 border-coral-500/20">
            <p className="text-sm text-coral-100/80 max-w-2xl">
              <span className="font-semibold text-coral-400">transparency matters:</span> we're honest about our limitations too. heartlines is not hipaa compliant and should not be used for medical advice. 
              for security concerns, contact us at <span className="text-coral-300">security@heartlines.ai</span>
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
});
