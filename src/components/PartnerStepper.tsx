import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PartnerStepperProps {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  onComplete: () => void;
}

const PartnerStepper = ({ onComplete }: PartnerStepperProps) => {
  return (
    <div className="partner-stepper min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Partner Profile Coming Soon</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Partner profile stepper is being developed. For now, please complete your personal profile.
            </p>
            <button 
              onClick={onComplete}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Continue to Dashboard
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnerStepper;