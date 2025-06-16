
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ProfileFormPage2Props {
  profileType: 'your' | 'partner';
  onComplete: (data: any) => void;
  onBack: () => void;
  initialData: any;
}

const ProfileFormPage2 = ({ profileType, onComplete, onBack, initialData }: ProfileFormPage2Props) => {
  const [formData, setFormData] = useState({
    needToTalkImmediately: initialData.needToTalkImmediately || '',
    goSilentWhenUpset: initialData.goSilentWhenUpset || '',
    feelHeardWithValidation: initialData.feelHeardWithValidation || '',
    talkThroughStressImmediately: initialData.talkThroughStressImmediately || '',
    needSpaceToProcess: initialData.needSpaceToProcess || '',
    withdrawWhenOverwhelmed: initialData.withdrawWhenOverwhelmed || '',
    physicalComfortHelps: initialData.physicalComfortHelps || '',
    beingRushedMakesWorse: initialData.beingRushedMakesWorse || '',
    ...initialData
  });

  const isPersonal = profileType === 'your';
  const pronoun = isPersonal ? 'you' : 'they';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.needToTalkImmediately && formData.goSilentWhenUpset && 
                     formData.feelHeardWithValidation && formData.talkThroughStressImmediately && 
                     formData.needSpaceToProcess && formData.withdrawWhenOverwhelmed && 
                     formData.physicalComfortHelps && formData.beingRushedMakesWorse;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Conflict & Stress Patterns
        </h3>
        
        {/* Conflict Style Questions */}
        <div className="space-y-6">
          <h4 className="text-lg font-medium text-gray-800 mb-4">Conflict Approach</h4>
          
          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              When there's a problem, {pronoun} need to talk about it immediately
            </Label>
            <RadioGroup 
              value={formData.needToTalkImmediately} 
              onValueChange={(value) => updateField('needToTalkImmediately', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Strongly Agree" id="talk-sa" />
                <Label htmlFor="talk-sa">Strongly Agree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Agree" id="talk-a" />
                <Label htmlFor="talk-a">Agree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Neutral" id="talk-n" />
                <Label htmlFor="talk-n">Neutral</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Disagree" id="talk-d" />
                <Label htmlFor="talk-d">Disagree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Strongly Disagree" id="talk-sd" />
                <Label htmlFor="talk-sd">Strongly Disagree</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              When upset, {pronoun} tend to go silent and withdraw
            </Label>
            <RadioGroup 
              value={formData.goSilentWhenUpset} 
              onValueChange={(value) => updateField('goSilentWhenUpset', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Strongly Agree" id="silent-sa" />
                <Label htmlFor="silent-sa">Strongly Agree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Agree" id="silent-a" />
                <Label htmlFor="silent-a">Agree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Neutral" id="silent-n" />
                <Label htmlFor="silent-n">Neutral</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Disagree" id="silent-d" />
                <Label htmlFor="silent-d">Disagree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Strongly Disagree" id="silent-sd" />
                <Label htmlFor="silent-sd">Strongly Disagree</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              {isPersonal ? 'You' : 'They'} feel most heard when {isPersonal ? 'your' : 'their'} feelings are validated first
            </Label>
            <RadioGroup 
              value={formData.feelHeardWithValidation} 
              onValueChange={(value) => updateField('feelHeardWithValidation', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Strongly Agree" id="validation-sa" />
                <Label htmlFor="validation-sa">Strongly Agree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Agree" id="validation-a" />
                <Label htmlFor="validation-a">Agree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Neutral" id="validation-n" />
                <Label htmlFor="validation-n">Neutral</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Disagree" id="validation-d" />
                <Label htmlFor="validation-d">Disagree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Strongly Disagree" id="validation-sd" />
                <Label htmlFor="validation-sd">Strongly Disagree</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Stress Response */}
        <div className="mt-8">
          <h4 className="text-lg font-medium text-gray-800 mb-4">Stress Response</h4>
          
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium text-gray-700 mb-3 block">
                When stressed, {pronoun} want to talk through it immediately
              </Label>
              <RadioGroup 
                value={formData.talkThroughStressImmediately} 
                onValueChange={(value) => updateField('talkThroughStressImmediately', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Strongly Agree" id="stress-talk-sa" />
                  <Label htmlFor="stress-talk-sa">Strongly Agree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Agree" id="stress-talk-a" />
                  <Label htmlFor="stress-talk-a">Agree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Neutral" id="stress-talk-n" />
                  <Label htmlFor="stress-talk-n">Neutral</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Disagree" id="stress-talk-d" />
                  <Label htmlFor="stress-talk-d">Disagree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Strongly Disagree" id="stress-talk-sd" />
                  <Label htmlFor="stress-talk-sd">Strongly Disagree</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium text-gray-700 mb-3 block">
                When overwhelmed, {pronoun} need space to process alone first
              </Label>
              <RadioGroup 
                value={formData.needSpaceToProcess} 
                onValueChange={(value) => updateField('needSpaceToProcess', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Strongly Agree" id="space-sa" />
                  <Label htmlFor="space-sa">Strongly Agree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Agree" id="space-a" />
                  <Label htmlFor="space-a">Agree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Neutral" id="space-n" />
                  <Label htmlFor="space-n">Neutral</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Disagree" id="space-d" />
                  <Label htmlFor="space-d">Disagree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Strongly Disagree" id="space-sd" />
                  <Label htmlFor="space-sd">Strongly Disagree</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium text-gray-700 mb-3 block">
                When overwhelmed, {pronoun} tend to withdraw emotionally
              </Label>
              <RadioGroup 
                value={formData.withdrawWhenOverwhelmed} 
                onValueChange={(value) => updateField('withdrawWhenOverwhelmed', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Strongly Agree" id="withdraw-sa" />
                  <Label htmlFor="withdraw-sa">Strongly Agree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Agree" id="withdraw-a" />
                  <Label htmlFor="withdraw-a">Agree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Neutral" id="withdraw-n" />
                  <Label htmlFor="withdraw-n">Neutral</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Disagree" id="withdraw-d" />
                  <Label htmlFor="withdraw-d">Disagree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Strongly Disagree" id="withdraw-sd" />
                  <Label htmlFor="withdraw-sd">Strongly Disagree</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium text-gray-700 mb-3 block">
                Physical comfort (hugs, touch) helps {pronoun} when stressed
              </Label>
              <RadioGroup 
                value={formData.physicalComfortHelps} 
                onValueChange={(value) => updateField('physicalComfortHelps', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Strongly Agree" id="comfort-sa" />
                  <Label htmlFor="comfort-sa">Strongly Agree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Agree" id="comfort-a" />
                  <Label htmlFor="comfort-a">Agree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Neutral" id="comfort-n" />
                  <Label htmlFor="comfort-n">Neutral</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Disagree" id="comfort-d" />
                  <Label htmlFor="comfort-d">Disagree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Strongly Disagree" id="comfort-sd" />
                  <Label htmlFor="comfort-sd">Strongly Disagree</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium text-gray-700 mb-3 block">
                Being rushed to resolve issues makes things worse for {pronoun}
              </Label>
              <RadioGroup 
                value={formData.beingRushedMakesWorse} 
                onValueChange={(value) => updateField('beingRushedMakesWorse', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Strongly Agree" id="rushed-sa" />
                  <Label htmlFor="rushed-sa">Strongly Agree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Agree" id="rushed-a" />
                  <Label htmlFor="rushed-a">Agree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Neutral" id="rushed-n" />
                  <Label htmlFor="rushed-n">Neutral</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Disagree" id="rushed-d" />
                  <Label htmlFor="rushed-d">Disagree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Strongly Disagree" id="rushed-sd" />
                  <Label htmlFor="rushed-sd">Strongly Disagree</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button 
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Page 1
        </Button>
        
        <Button 
          type="submit" 
          disabled={!isFormValid}
          className="flex items-center gap-2"
        >
          Continue to Page 3
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};

export default ProfileFormPage2;
