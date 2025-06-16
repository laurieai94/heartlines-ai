
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

interface ProfileFormPage1Props {
  profileType: 'your' | 'partner';
  onComplete: (data: any) => void;
  initialData: any;
}

const ProfileFormPage1 = ({ profileType, onComplete, initialData }: ProfileFormPage1Props) => {
  const [formData, setFormData] = useState({
    directCommunication: initialData.directCommunication || '',
    gentleApproach: initialData.gentleApproach || '',
    needTimeToProcess: initialData.needTimeToProcess || '',
    wordsOfAffirmation: initialData.wordsOfAffirmation || '',
    qualityTime: initialData.qualityTime || '',
    physicalTouch: initialData.physicalTouch || '',
    actsOfService: initialData.actsOfService || '',
    receivingGifts: initialData.receivingGifts || '',
    ...initialData
  });

  const isPersonal = profileType === 'your';
  const pronoun = isPersonal ? 'you' : 'they';
  const possessive = isPersonal ? 'your' : 'their';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.directCommunication && formData.gentleApproach && 
                     formData.needTimeToProcess && formData.wordsOfAffirmation && 
                     formData.qualityTime && formData.physicalTouch && 
                     formData.actsOfService && formData.receivingGifts;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Communication Style & Love Languages
        </h3>
        
        {/* Communication Style Questions */}
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              {isPersonal ? 'Do you' : 'Do they'} prefer direct, straightforward communication?
            </Label>
            <RadioGroup 
              value={formData.directCommunication} 
              onValueChange={(value) => updateField('directCommunication', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Strongly Agree" id="direct-sa" />
                <Label htmlFor="direct-sa">Strongly Agree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Agree" id="direct-a" />
                <Label htmlFor="direct-a">Agree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Neutral" id="direct-n" />
                <Label htmlFor="direct-n">Neutral</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Disagree" id="direct-d" />
                <Label htmlFor="direct-d">Disagree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Strongly Disagree" id="direct-sd" />
                <Label htmlFor="direct-sd">Strongly Disagree</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              {isPersonal ? 'Do you' : 'Do they'} prefer a gentle, tactful approach to sensitive topics?
            </Label>
            <RadioGroup 
              value={formData.gentleApproach} 
              onValueChange={(value) => updateField('gentleApproach', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Strongly Agree" id="gentle-sa" />
                <Label htmlFor="gentle-sa">Strongly Agree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Agree" id="gentle-a" />
                <Label htmlFor="gentle-a">Agree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Neutral" id="gentle-n" />
                <Label htmlFor="gentle-n">Neutral</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Disagree" id="gentle-d" />
                <Label htmlFor="gentle-d">Disagree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Strongly Disagree" id="gentle-sd" />
                <Label htmlFor="gentle-sd">Strongly Disagree</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              {isPersonal ? 'Do you' : 'Do they'} need time to process before responding to important conversations?
            </Label>
            <RadioGroup 
              value={formData.needTimeToProcess} 
              onValueChange={(value) => updateField('needTimeToProcess', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Strongly Agree" id="process-sa" />
                <Label htmlFor="process-sa">Strongly Agree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Agree" id="process-a" />
                <Label htmlFor="process-a">Agree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Neutral" id="process-n" />
                <Label htmlFor="process-n">Neutral</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Disagree" id="process-d" />
                <Label htmlFor="process-d">Disagree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Strongly Disagree" id="process-sd" />
                <Label htmlFor="process-sd">Strongly Disagree</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Love Languages */}
        <div className="mt-8">
          <h4 className="text-lg font-medium text-gray-800 mb-4">Love Languages</h4>
          
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium text-gray-700 mb-3 block">
                Words of affirmation make {pronoun} feel most loved
              </Label>
              <RadioGroup 
                value={formData.wordsOfAffirmation} 
                onValueChange={(value) => updateField('wordsOfAffirmation', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Strongly Agree" id="words-sa" />
                  <Label htmlFor="words-sa">Strongly Agree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Agree" id="words-a" />
                  <Label htmlFor="words-a">Agree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Neutral" id="words-n" />
                  <Label htmlFor="words-n">Neutral</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Disagree" id="words-d" />
                  <Label htmlFor="words-d">Disagree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Strongly Disagree" id="words-sd" />
                  <Label htmlFor="words-sd">Strongly Disagree</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium text-gray-700 mb-3 block">
                Quality time together is {possessive} primary love language
              </Label>
              <RadioGroup 
                value={formData.qualityTime} 
                onValueChange={(value) => updateField('qualityTime', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Strongly Agree" id="time-sa" />
                  <Label htmlFor="time-sa">Strongly Agree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Agree" id="time-a" />
                  <Label htmlFor="time-a">Agree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Neutral" id="time-n" />
                  <Label htmlFor="time-n">Neutral</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Disagree" id="time-d" />
                  <Label htmlFor="time-d">Disagree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Strongly Disagree" id="time-sd" />
                  <Label htmlFor="time-sd">Strongly Disagree</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium text-gray-700 mb-3 block">
                Physical touch is important for {possessive} sense of connection
              </Label>
              <RadioGroup 
                value={formData.physicalTouch} 
                onValueChange={(value) => updateField('physicalTouch', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Strongly Agree" id="touch-sa" />
                  <Label htmlFor="touch-sa">Strongly Agree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Agree" id="touch-a" />
                  <Label htmlFor="touch-a">Agree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Neutral" id="touch-n" />
                  <Label htmlFor="touch-n">Neutral</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Disagree" id="touch-d" />
                  <Label htmlFor="touch-d">Disagree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Strongly Disagree" id="touch-sd" />
                  <Label htmlFor="touch-sd">Strongly Disagree</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium text-gray-700 mb-3 block">
                Acts of service make {pronoun} feel most cared for
              </Label>
              <RadioGroup 
                value={formData.actsOfService} 
                onValueChange={(value) => updateField('actsOfService', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Strongly Agree" id="service-sa" />
                  <Label htmlFor="service-sa">Strongly Agree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Agree" id="service-a" />
                  <Label htmlFor="service-a">Agree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Neutral" id="service-n" />
                  <Label htmlFor="service-n">Neutral</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Disagree" id="service-d" />
                  <Label htmlFor="service-d">Disagree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Strongly Disagree" id="service-sd" />
                  <Label htmlFor="service-sd">Strongly Disagree</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium text-gray-700 mb-3 block">
                Thoughtful gifts are meaningful to {pronoun}
              </Label>
              <RadioGroup 
                value={formData.receivingGifts} 
                onValueChange={(value) => updateField('receivingGifts', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Strongly Agree" id="gifts-sa" />
                  <Label htmlFor="gifts-sa">Strongly Agree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Agree" id="gifts-a" />
                  <Label htmlFor="gifts-a">Agree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Neutral" id="gifts-n" />
                  <Label htmlFor="gifts-n">Neutral</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Disagree" id="gifts-d" />
                  <Label htmlFor="gifts-d">Disagree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Strongly Disagree" id="gifts-sd" />
                  <Label htmlFor="gifts-sd">Strongly Disagree</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button 
          type="submit" 
          disabled={!isFormValid}
          className="flex items-center gap-2"
        >
          Continue to Page 2
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};

export default ProfileFormPage1;
