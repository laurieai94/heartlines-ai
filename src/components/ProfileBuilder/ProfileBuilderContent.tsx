
import ValueProposition from "./ValueProposition";
import ProfileTips from "./ProfileTips";
import ProfileCardGrid from "./ProfileCardGrid";

interface ProfileBuilderContentProps {
  yourProfileCompletion: number;
  partnerProfileCompletion: number;
  onStartPersonalProfile: () => void;
  onStartPartnerProfile: () => void;
}

const ProfileBuilderContent = ({
  yourProfileCompletion,
  partnerProfileCompletion,
  onStartPersonalProfile,
  onStartPartnerProfile
}: ProfileBuilderContentProps) => {
  return (
    <div className="flex-1 min-h-0 space-y-4">
      {/* Compact Two-Card Layout */}
      <ProfileCardGrid
        yourProfileCompletion={yourProfileCompletion}
        partnerProfileCompletion={partnerProfileCompletion}
        onStartPersonalProfile={onStartPersonalProfile}
        onStartPartnerProfile={onStartPartnerProfile}
      />

      {/* Compact Value Proposition */}
      <ValueProposition />

      {/* Collapsible Tips Section */}
      <ProfileTips />
    </div>
  );
};

export default ProfileBuilderContent;
