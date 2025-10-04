import { Card } from "@/components/ui/card";
import { Shield, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const SafetyResourcesCard = () => {
  return (
    <Card className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm animate-slide-up transition-all duration-300">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-3 h-3 text-blue-300" />
        <h3 className="text-sm font-medium text-white">Crisis Resources</h3>
      </div>
      <div className="text-xs text-pink-200/60 space-y-1 mb-2">
        <p>• 988: Suicide & Crisis Lifeline</p>
        <p>• 1-800-799-7233: DV Hotline</p>
        <p>• Text HOME to 741741</p>
      </div>
      <Link 
        to="/safety" 
        className="text-xs text-blue-300 hover:text-blue-200 flex items-center gap-1"
      >
        <Phone className="w-3 h-3" />
        View all resources
      </Link>
    </Card>
  );
};

export default SafetyResourcesCard;
