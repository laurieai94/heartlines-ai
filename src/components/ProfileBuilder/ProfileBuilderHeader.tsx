
interface ProfileBuilderHeaderProps {}

const ProfileBuilderHeader = ({}: ProfileBuilderHeaderProps) => {
  return (
    <div className="text-center space-y-2 flex-shrink-0">
      <h1 className="text-2xl font-bold text-white">
        Let's Get to Know the Real You
      </h1>
      <p className="text-base text-pink-200/80 max-w-2xl mx-auto">
        Build your relationship profiles to unlock personalized insights
      </p>
    </div>
  );
};

export default ProfileBuilderHeader;
