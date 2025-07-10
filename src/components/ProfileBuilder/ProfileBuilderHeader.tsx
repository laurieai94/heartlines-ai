

interface ProfileBuilderHeaderProps {}

const ProfileBuilderHeader = ({}: ProfileBuilderHeaderProps) => {
  return (
    <div className="text-center space-y-2 flex-shrink-0">
      <h1 className="text-2xl font-bold text-white">
        Help Us Get Your Situationship Right
      </h1>
      <p className="text-base text-pink-200/80 max-w-2xl mx-auto">
        Build your profiles so we can give you advice that fits how you two work
      </p>
    </div>
  );
};

export default ProfileBuilderHeader;

