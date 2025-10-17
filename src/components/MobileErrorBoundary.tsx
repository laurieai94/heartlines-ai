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
  private stuckTimer: NodeJS.Timeout | null = null;
  
  constructor(props: MobileErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): MobileErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidMount() {
    // iOS-specific stuck state detection
    if (typeof window !== 'undefined') {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      if (isIOS) {
        // If iOS device is stuck loading for >8 seconds, auto-trigger error boundary
        this.stuckTimer = setTimeout(() => {
          const isStillLoading = document.querySelector('[data-loading="true"]');
          if (isStillLoading) {
            console.error('[MobileErrorBoundary] iOS stuck state detected after 8s');
            this.setState({
              hasError: true,
              error: new Error('iOS Safari appears to be stuck. Please try the solutions below.')
            });
          }
        }, 8000);
      }
    }
  }

  componentWillUnmount() {
    if (this.stuckTimer) {
      clearTimeout(this.stuckTimer);
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Clear stuck timer if real error occurs
    if (this.stuckTimer) {
      clearTimeout(this.stuckTimer);
    }
    
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
              {/iPad|iPhone|iPod/.test(navigator.userAgent) && (
                <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg text-left">
                  <p className="font-semibold mb-2">iOS Safari troubleshooting:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Clear Safari cache (Settings → Safari → Clear History)</li>
                    <li>Close other open tabs</li>
                    <li>Restart Safari</li>
                    <li>Try in Private Browsing mode</li>
                  </ul>
                </div>
              )}
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