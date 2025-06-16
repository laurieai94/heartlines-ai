
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";

interface PartnerProfileSelectorProps {
  partnerProfiles: any[];
  partnerName: string;
  selectedPartnerProfile: string;
  onProfileSelect: (value: string) => void;
}

const PartnerProfileSelector = ({ 
  partnerProfiles, 
  partnerName, 
  selectedPartnerProfile, 
  onProfileSelect 
}: PartnerProfileSelectorProps) => {
  if (!partnerProfiles.length) return null;

  return (
    <Card className="p-6 bg-white/60 backdrop-blur-md border-0 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Partner Profile for Role-Play</h3>
          <p className="text-sm text-gray-600">Select which partner profile the AI should use to simulate {partnerName}</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <Select value={selectedPartnerProfile} onValueChange={onProfileSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Select ${partnerName}'s profile for simulation`} />
          </SelectTrigger>
          <SelectContent>
            {partnerProfiles.map((profile, index) => (
              <SelectItem key={index} value={index.toString()}>
                {partnerName}'s Profile {partnerProfiles.length > 1 ? `#${index + 1}` : ''}
                {profile.relationshipLength && (
                  <span className="text-xs text-gray-500 ml-2">
                    ({profile.relationshipLength} relationship)
                  </span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedPartnerProfile && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
            ✅ AI will role-play as {partnerName} using their selected profile traits and communication style
          </div>
        )}
      </div>
    </Card>
  );
};

export default PartnerProfileSelector;
