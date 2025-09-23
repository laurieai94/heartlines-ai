
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";

const ProfileTips = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <Button 
        variant="ghost" 
        onClick={() => setShowDetails(!showDetails)}
        className="w-full text-pink-200/80 hover:text-white text-sm py-2 hover:bg-white/10"
      >
        {showDetails ? 'Hide ' : ''}Profile Building Tips
        <ArrowRight className={`w-4 h-4 ml-2 transition-transform duration-300 ${showDetails ? 'rotate-90' : ''}`} />
      </Button>
      
      {showDetails && (
        <div className="mt-4 space-y-3 animate-fade-in">
          <Card className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Profile Building Tips</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Be honest</h4>
                    <p className="text-pink-200/80 text-xs">The AI only works with real data, not aspirational answers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">"Not sure yet" is okay</h4>
                    <p className="text-pink-200/80 text-xs">Profiles improve as you learn more about each other</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Start with core questions</h4>
                    <p className="text-pink-200/80 text-xs">Get immediate value, then expand sections over time</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Update as you grow</h4>
                    <p className="text-pink-200/80 text-xs">Relationships evolve, and so should your profiles</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProfileTips;
