import React, { Component, ReactNode } from 'react';
import { toast } from 'sonner';

interface MobileProfileBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface MobileProfileBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

class MobileProfileBoundary extends Component<MobileProfileBoundaryProps, MobileProfileBoundaryState> {
  constructor(props: MobileProfileBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): MobileProfileBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Show user-friendly error message
    toast.error('Profile temporarily unavailable. Please try again.');

    // Send to analytics in production
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }

    // Attempt automatic recovery after a delay
    setTimeout(() => {
      this.setState({ hasError: false, error: null });
    }, 3000);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-white mb-4">
              Profile Temporarily Unavailable
            </h2>
            <p className="text-white/70 mb-6">
              We're working to restore your profile. This will resolve automatically in a few seconds.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 hover:from-orange-500 hover:via-rose-600 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
            >
              Retry Now
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MobileProfileBoundary;