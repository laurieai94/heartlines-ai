interface ProfileCompletionOptionsProps {
  completionType: 'personal' | 'partner';
  onAddPartnerProfile: () => void;
  onStartChatting: () => void;
  onClose: () => void;
  onEditProfile: () => void;
  hasPartnerProfile: boolean;
}

const ProfileCompletionOptions = ({
  completionType,
  onAddPartnerProfile,
  onStartChatting,
  onClose,
  onEditProfile,
  hasPartnerProfile
}: ProfileCompletionOptionsProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background rounded-2xl p-6 max-w-md mx-4 space-y-4 shadow-xl border border-border">
        <h2 className="text-xl font-semibold text-foreground">
          {completionType === 'personal' ? 'Profile Complete!' : 'Partner Profile Complete!'}
        </h2>
        <p className="text-muted-foreground">
          Great job! What would you like to do next?
        </p>
        <div className="space-y-2">
          <button
            onClick={onStartChatting}
            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Start Chatting with Kai
          </button>
          {!hasPartnerProfile && completionType === 'personal' && (
            <button
              onClick={onAddPartnerProfile}
              className="w-full py-3 px-4 bg-secondary text-secondary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Add Partner Profile
            </button>
          )}
          <button
            onClick={onEditProfile}
            className="w-full py-3 px-4 bg-muted text-muted-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Edit Profile
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-muted-foreground text-sm hover:text-foreground transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionOptions;
