
interface QuestionnaireLoadingProps {}

const QuestionnaireLoading = ({}: QuestionnaireLoadingProps) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/80">Loading your profile...</p>
      </div>
    </div>
  );
};

export default QuestionnaireLoading;
