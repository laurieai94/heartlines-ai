import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Smartphone, Wifi } from 'lucide-react';

interface MobileErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface MobileErrorBoundaryProps {
  children: React.ReactNode;
}

class MobileErrorBoundary extends React.Component<MobileErrorBoundaryProps, MobileErrorBoundaryState> {
  constructor(props: MobileErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): MobileErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Send error to analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
    
    // Force a page reload on mobile to clear any stuck state
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-sm mx-auto text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-destructive" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-xl font-semibold text-foreground">
                Something went wrong
              </h1>
              <p className="text-sm text-muted-foreground">
                We're having trouble loading the page on your device.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={this.retry}
                className="w-full"
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Wifi className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-destructive/5 rounded-lg p-3 border">
                <summary className="cursor-pointer text-sm font-medium text-destructive mb-2">
                  Error Details
                </summary>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap overflow-auto max-h-32">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MobileErrorBoundary;