import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, ChevronDown, Shield, Mail, Clock, BarChart3 } from "lucide-react";

export const PrivacyByDesign = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="max-w-4xl mx-auto sticky top-4 z-20">
      <div className="rounded-xl ring-1 ring-white/20 bg-gradient-to-r from-white/8 via-white/5 to-white/8 backdrop-blur-sm shadow-lg shadow-white/5">
        <Button
          variant="ghost"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm text-white/90 hover:bg-white/5 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-white/20 rounded-full blur-sm"></div>
              <div className="relative bg-white/10 p-1.5 rounded-full ring-1 ring-white/25">
                <Lock className="w-3.5 h-3.5 text-white/80" />
              </div>
            </div>
            <p className="text-white/90">
              <span className="font-medium text-white">Private by design — only you (and Kai) see your profiles. Everything's encrypted, private, and in your hands.</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60 hidden sm:inline">
              {showDetails ? "Hide Privacy Details" : "Show Privacy Details"}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`} />
          </div>
        </Button>

        {showDetails && (
          <div className="border-t border-white/10 p-4">
            <Card className="glass-burgundy border-white/20">
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Data Protection */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <Shield className="h-4 w-4 text-coral-400" />
                      Data Protection
                    </div>
                    <div className="space-y-2 text-sm text-white/80">
                      <div className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-white/60 mt-2 flex-shrink-0"></div>
                        <span>AES-256 encryption for all conversations</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-white/60 mt-2 flex-shrink-0"></div>
                        <span>Local storage with encryption keys</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-white/60 mt-2 flex-shrink-0"></div>
                        <span>Secure cloud backup options</span>
                      </div>
                    </div>
                  </div>

                  {/* Communication Control */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <Mail className="h-4 w-4 text-coral-400" />
                      Communication Control
                    </div>
                    <div className="space-y-2 text-sm text-white/80">
                      <div className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-white/60 mt-2 flex-shrink-0"></div>
                        <span>No spam or marketing emails</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-white/60 mt-2 flex-shrink-0"></div>
                        <span>You control all notifications</span>
                      </div>
                    </div>
                  </div>

                  {/* Data Management */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <Clock className="h-4 w-4 text-coral-400" />
                      Data Management
                    </div>
                    <div className="space-y-2 text-sm text-white/80">
                      <div className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-white/60 mt-2 flex-shrink-0"></div>
                        <span>Choose retention periods (30 days - forever)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-white/60 mt-2 flex-shrink-0"></div>
                        <span>Easy data export and deletion</span>
                      </div>
                    </div>
                  </div>

                  {/* Privacy-First Analytics */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <BarChart3 className="h-4 w-4 text-coral-400" />
                      Privacy-First Analytics
                    </div>
                    <div className="space-y-2 text-sm text-white/80">
                      <div className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-white/60 mt-2 flex-shrink-0"></div>
                        <span>Anonymous usage data only</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-white/60 mt-2 flex-shrink-0"></div>
                        <span>Opt-out anytime</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};