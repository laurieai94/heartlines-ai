
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, User, Heart, ArrowLeft } from "lucide-react";

interface ProfileViewerProps {
  profileType: 'your' | 'partner';
  profileData: any;
  demographicsData: any;
  onEdit: () => void;
  onClose: () => void;
}

const ProfileViewer = ({ profileType, profileData, demographicsData, onEdit, onClose }: ProfileViewerProps) => {
  const isPersonal = profileType === 'your';
  const name = demographicsData?.name || (isPersonal ? 'Your' : 'Partner');

  const renderSection = (title: string, data: any, fields: string[]) => {
    const hasData = fields.some(field => data[field] && data[field] !== '');
    if (!hasData) return null;

    return (
      <Card className="p-4">
        <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {fields.map(field => {
            if (!data[field] || data[field] === '') return null;
            
            const value = Array.isArray(data[field]) ? data[field] : [data[field]];
            const label = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            
            return (
              <div key={field} className="space-y-1">
                <span className="font-medium text-gray-700 text-sm">{label}:</span>
                <div className="flex flex-wrap gap-1">
                  {value.map((val: string, index: number) => (
                    <Badge key={`${field}-${index}`} variant="outline" className="text-sm">
                      {val}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl sm:max-w-4xl lg:max-w-5xl w-full max-h-[90vh] overflow-y-auto scrollbar-sleek">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isPersonal 
                  ? 'bg-gradient-to-r from-pink-500 to-fuchsia-500' 
                  : 'bg-gradient-to-r from-rose-400 to-pink-400'
              }`}>
                {isPersonal ? <User className="w-6 h-6 text-white" /> : <Heart className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{name}'s Profile</h2>
                <p className="text-gray-600">View and edit profile details</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={onEdit} className="flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </Button>
              <Button variant="outline" onClick={onClose}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Demographics */}
          {demographicsData && renderSection(
            "Basic Information",
            demographicsData,
            ['name', 'pronouns', 'age', 'sexualOrientation', 'genderIdentity', 'education', 'workSituation', 'income']
          )}

          {/* Profile Data */}
          {profileData.length > 0 && (
            <>
              {renderSection(
                "Communication & Love Languages",
                profileData[0],
                ['importantTalkPreference', 'communicationDirectness', 'emotionExpression', 'loveLanguages']
              )}

              {renderSection(
                "Conflict & Stress Patterns",
                profileData[0],
                ['conflictResponse', 'stressSpaceNeed', 'stressSupportNeed', 'goSilentWhenUpset', 'needToTalkImmediately']
              )}

              {renderSection(
                "Attachment & Growth",
                profileData[0],
                ['comfortableClosenessIndependence', 'worryRelationshipSecurity', 'wantClosenessButFearHurt', 'relationshipLength', 'relationshipType']
              )}
            </>
          )}

          {profileData.length === 0 && !demographicsData && (
            <div className="text-center py-8">
              <p className="text-gray-500">No profile data available yet.</p>
              <Button onClick={onEdit} className="mt-4">
                Start Building Profile
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileViewer;
