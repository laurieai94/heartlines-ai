import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronRight, MapPin, Check, Circle, Clock } from "lucide-react";
import { ProfileData } from "../types";
import { getNextQuestion } from "../utils/next-map";
import { useAutoScroll } from "../hooks/useAutoScroll";

interface QuestionNavigatorProps {
  profileData: ProfileData;
  currentSection: number;
  onQuestionClick: (questionId: string) => void;
}

interface QuestionInfo {
  id: string;
  title: string;
  section: number;
  isCompleted: boolean;
  isOptional: boolean;
  isAccessible: boolean;
}

const QuestionNavigator = ({ profileData, currentSection, onQuestionClick }: QuestionNavigatorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [questions, setQuestions] = useState<QuestionInfo[]>([]);
  const { scrollToElement } = useAutoScroll();
  const navigatorRef = useRef<HTMLDivElement>(null);

  // Build question list based on current profile data and DOM state
  useEffect(() => {
    const buildQuestionList = (): QuestionInfo[] => {
      const questionList: QuestionInfo[] = [];
      
      // Define all possible questions with their metadata
      const allQuestions = [
        // Section 1: Who You Are
        { id: 'question-name-pronouns', title: 'Name & Pronouns', section: 1, isOptional: false },
        { id: 'question-age-selection', title: 'Age', section: 1, isOptional: false },
        { id: 'question-gender-selection', title: 'Gender', section: 1, isOptional: false },
        { id: 'question-orientation-selection', title: 'Orientation', section: 1, isOptional: false },
        { id: 'question-relationship-status', title: 'Relationship Status', section: 2, isOptional: false },
        
        // Section 2: Your Relationship (dynamic based on status)
        { id: 'question-single-dating', title: 'Dating Activity', section: 2, isOptional: false },
        { id: 'question-single-why', title: 'Single Reasons', section: 2, isOptional: false },
        { id: 'question-talking-length', title: 'Talking Length', section: 2, isOptional: false },
        { id: 'question-talking-challenges', title: 'Talking Challenges', section: 2, isOptional: false },
        { id: 'question-relationship-length', title: 'Relationship Length', section: 2, isOptional: false },
        { id: 'question-relationship-challenges', title: 'Relationship Challenges', section: 2, isOptional: false },
        { id: 'question-marriage-length', title: 'Marriage Length', section: 2, isOptional: false },
        { id: 'question-marriage-challenges', title: 'Marriage Challenges', section: 2, isOptional: false },
        { id: 'question-separated-length', title: 'Separation Length', section: 2, isOptional: false },
        { id: 'question-separated-challenges', title: 'Separation Challenges', section: 2, isOptional: false },
        { id: 'question-divorced-length', title: 'Divorce Length', section: 2, isOptional: false },
        { id: 'question-divorced-challenges', title: 'Divorce Challenges', section: 2, isOptional: false },
        { id: 'question-widowed-length', title: 'Widowed Length', section: 2, isOptional: false },
        { id: 'question-widowed-challenges', title: 'Widowed Challenges', section: 2, isOptional: false },
        
        // Section 3: How You Operate
        { id: 'question-love-language', title: 'Love Language', section: 3, isOptional: false },
        { id: 'question-conflict-style', title: 'Conflict Style', section: 3, isOptional: false },
        { id: 'question-stress-response', title: 'Stress Response', section: 3, isOptional: false },
        
        // Section 4: Your Foundation
        { id: 'question-attachment-style', title: 'Attachment Style', section: 4, isOptional: false },
        { id: 'question-family-structure', title: 'Family Structure', section: 4, isOptional: false },
        { id: 'question-heartbreak-betrayal', title: 'Past Experiences', section: 4, isOptional: false },
      ];

      // Filter questions based on current DOM state and profile data
      allQuestions.forEach((q) => {
        const element = document.getElementById(q.id);
        if (element) {
          // Check if question is in an optional group
          const optionalContent = element.closest('[data-optional-content]');
          const isInOptionalGroup = !!optionalContent;
          const isOptionalOpen = optionalContent?.getAttribute('data-optional-open') === 'true';
          
          // Only include if visible or if in an open optional group
          if (!isInOptionalGroup || isOptionalOpen) {
            const isCompleted = checkQuestionCompletion(q.id, profileData);
            const isAccessible = isQuestionAccessible(q.id, profileData);
            
            questionList.push({
              ...q,
              isCompleted,
              isAccessible,
              isOptional: isInOptionalGroup
            });
          }
        }
      });

      return questionList;
    };

    setQuestions(buildQuestionList());
  }, [profileData, currentSection]);

  // Check if a question is completed based on profile data
  const checkQuestionCompletion = (questionId: string, data: ProfileData): boolean => {
    switch (questionId) {
      case 'question-name-pronouns':
        return !!(data.name && data.pronouns);
      case 'question-age-selection':
        return !!data.age;
      case 'question-gender-selection':
        return !!data.gender;
      case 'question-orientation-selection':
        return !!data.orientation;
      case 'question-relationship-status':
        return !!data.relationshipStatus;
      case 'question-love-language':
        return !!(data.loveLanguage && data.loveLanguage.length > 0);
      case 'question-conflict-style':
        return !!data.conflictStyle;
      case 'question-stress-response':
        return !!data.stressResponse;
      case 'question-attachment-style':
        return !!data.attachmentStyle;
      case 'question-family-structure':
        return !!data.familyStructure;
      case 'question-heartbreak-betrayal':
        return !!data.heartbreakBetrayal;
      // Add more cases as needed for relationship-specific questions
      default:
        return false;
    }
  };

  // Check if a question is accessible (previous questions completed)
  const isQuestionAccessible = (questionId: string, data: ProfileData): boolean => {
    // For now, assume all visible questions are accessible
    // This can be enhanced with more complex logic
    return true;
  };

  const handleQuestionClick = (questionId: string) => {
    scrollToElement(questionId);
    onQuestionClick(questionId);
    setIsExpanded(false); // Collapse after selection
  };

  const getQuestionIcon = (question: QuestionInfo) => {
    if (question.isCompleted) {
      return <Check className="w-3 h-3 text-emerald-400" />;
    }
    if (!question.isAccessible) {
      return <Circle className="w-2 h-2 text-white/30" />;
    }
    return <Clock className="w-3 h-3 text-amber-400" />;
  };

  const getNextIncompleteQuestion = () => {
    return questions.find(q => !q.isCompleted && q.isAccessible);
  };

  const sectionQuestions = questions.filter(q => q.section === currentSection);
  const nextIncomplete = getNextIncompleteQuestion();
  const completedCount = questions.filter(q => q.isCompleted).length;
  const totalCount = questions.length;

  return (
    <div ref={navigatorRef} className="relative">
      {/* Main Navigator Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 rounded-lg transition-all duration-200 text-sm font-medium text-white"
      >
        <MapPin className="w-4 h-4" />
        <span className="hidden sm:inline">Questions</span>
        <span className="text-xs text-white/70">({completedCount}/{totalCount})</span>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {/* Quick Actions */}
      {nextIncomplete && (
        <button
          onClick={() => handleQuestionClick(nextIncomplete.id)}
          className="ml-2 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Next Question
        </button>
      )}

      {/* Expanded Navigator */}
      {isExpanded && (
        <div className="absolute top-full left-0 mt-2 w-80 max-w-[90vw] bg-burgundy-800/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">Question Navigator</h3>
              <span className="text-white/60 text-xs">{completedCount} of {totalCount} completed</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-1.5 mb-4">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-green-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>

            {/* Current Section Questions */}
            <div className="mb-4">
              <h4 className="text-white/80 text-xs font-medium mb-2 uppercase tracking-wide">
                Section {currentSection} Questions
              </h4>
              <div className="space-y-1">
                {sectionQuestions.map((question) => (
                  <button
                    key={question.id}
                    onClick={() => handleQuestionClick(question.id)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-left transition-all duration-200 ${
                      question.isCompleted
                        ? 'bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30'
                        : question.isAccessible
                          ? 'bg-white/5 text-white hover:bg-white/10'
                          : 'bg-white/5 text-white/50 cursor-not-allowed'
                    } ${question.isOptional ? 'border-l-2 border-amber-400/50 ml-2' : ''}`}
                    disabled={!question.isAccessible}
                  >
                    {getQuestionIcon(question)}
                    <span className="flex-1">{question.title}</span>
                    {question.isOptional && (
                      <span className="text-xs text-amber-400">Optional</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* All Questions Summary */}
            <div>
              <h4 className="text-white/80 text-xs font-medium mb-2 uppercase tracking-wide">
                All Questions
              </h4>
              <div className="grid grid-cols-4 gap-1">
                {questions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => handleQuestionClick(question.id)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-200 ${
                      question.isCompleted
                        ? 'bg-emerald-500 text-white'
                        : question.isAccessible
                          ? 'bg-white/20 text-white hover:bg-white/30'
                          : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                    disabled={!question.isAccessible}
                    title={question.title}
                  >
                    {question.isCompleted ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionNavigator;