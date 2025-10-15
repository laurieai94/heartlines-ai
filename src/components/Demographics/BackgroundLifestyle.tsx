
import { Label } from "@/components/ui/label";

interface BackgroundLifestyleProps {
  profileType?: 'your' | 'partner';
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const BackgroundLifestyle = ({ profileType = 'your', formData, updateFormData }: BackgroundLifestyleProps) => {
  const isPersonal = profileType === 'your';
  
  const educationOptions = [
    'high school or equivalent', 'some college/university', "associate's degree", "bachelor's degree", "master's degree", 'doctoral degree', 'trade/vocational training', 'other', 'prefer not to share'
  ];

  const workOptions = [
    'student', 'working full-time', 'working part-time', 'freelance/contract work', 'entrepreneur/business owner', 'stay-at-home parent', 'between jobs', 'retired', 'unable to work', 'other', 'prefer not to share'
  ];

  const incomeOptions = [
    'under $30,000', '$30,000 - $50,000', '$50,000 - $75,000', '$75,000 - $100,000', '$100,000 - $150,000', '$150,000 - $250,000', 'over $250,000', 'prefer not to share'
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Background & Lifestyle
        {isPersonal && <span className="text-red-500 text-sm ml-2">*Required</span>}
      </h3>

      {/* Education */}
      <div>
        <Label className="text-base font-medium mb-3 block">
          Education Level {isPersonal && <span className="text-red-500">*</span>}
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {educationOptions.map((education) => (
            <div key={education} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`education-${education}`}
                name="education"
                value={education}
                checked={formData.education === education}
                onChange={(e) => updateFormData('education', e.target.value)}
                className="w-4 h-4 text-orange-500"
              />
              <Label htmlFor={`education-${education}`} className="text-sm">
                {education}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Work Situation */}
      <div>
        <Label className="text-base font-medium mb-3 block">
          Work Situation {isPersonal && <span className="text-red-500">*</span>}
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {workOptions.map((work) => (
            <div key={work} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`work-${work}`}
                name="work"
                value={work}
                checked={formData.workSituation === work}
                onChange={(e) => updateFormData('workSituation', e.target.value)}
                className="w-4 h-4 text-orange-500"
              />
              <Label htmlFor={`work-${work}`} className="text-sm">
                {work}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Income */}
      <div>
        <Label className="text-base font-medium mb-3 block">Household Income (Optional)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {incomeOptions.map((income) => (
            <div key={income} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`income-${income}`}
                name="income"
                value={income}
                checked={formData.income === income}
                onChange={(e) => updateFormData('income', e.target.value)}
                className="w-4 h-4 text-orange-500"
              />
              <Label htmlFor={`income-${income}`} className="text-sm">
                {income}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BackgroundLifestyle;
