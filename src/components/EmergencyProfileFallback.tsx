import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface EmergencyProfileFallbackProps {
  onRetry: () => void;
  onContinueAnyway: () => void;
  isRetrying?: boolean;
}

const EmergencyProfileFallback = ({ 
  onRetry, 
  onContinueAnyway, 
  isRetrying = false 
}: EmergencyProfileFallbackProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Profile Loading Issue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            We're having trouble loading your profile data. This might be due to a slow connection.
          </p>
          
          <div className="space-y-2">
            <Button 
              onClick={onRetry} 
              className="w-full" 
              disabled={isRetrying}
            >
              {isRetrying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                'Try Again'
              )}
            </Button>
            
            <Button 
              onClick={onContinueAnyway} 
              variant="outline" 
              className="w-full"
            >
              Continue Anyway
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            You can continue and your data will sync in the background
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyProfileFallback;