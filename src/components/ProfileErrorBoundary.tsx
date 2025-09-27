import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface ProfileErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
}

interface ProfileErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error | null; retry: () => void }>;
}

class ProfileErrorBoundary extends React.Component<ProfileErrorBoundaryProps, ProfileErrorBoundaryState> {
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: ProfileErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<ProfileErrorBoundaryState> {
    return { 
      hasError: true, 
      error,
      errorCount: (this as any).state?.errorCount + 1 || 1
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ProfileErrorBoundary caught an error:', error, errorInfo);
    
    // Clear any profile-related localStorage data that might be causing issues
    if (this.state.errorCount > 2) {
      console.warn('Multiple profile errors detected, clearing potentially corrupted data');
      try {
        ['personal_profile_v2', 'partner_profile_v2'].forEach(key => {
          localStorage.removeItem(key);
        });
      } catch (e) {
        console.error('Failed to clear corrupted profile data:', e);
      }
    }
  }

  retry = () => {
    // Clear any pending timeouts
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }

    // If too many errors, wait before retrying
    if (this.state.errorCount > 3) {
      this.retryTimeout = setTimeout(() => {
        this.setState({ hasError: false, error: null });
      }, 2000);
    } else {
      this.setState({ hasError: false, error: null });
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.retry} />;
      }

      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-medium text-red-900">
              Profile Loading Error
            </h3>
          </div>
          
          <p className="text-red-700 mb-4">
            {this.state.errorCount > 2 
              ? "Multiple errors detected. We've cleared potentially corrupted data."
              : "There was an issue loading your profile data."}
          </p>

          <Button
            onClick={this.retry}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={this.state.errorCount > 3}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {this.state.errorCount > 3 ? 'Retrying...' : 'Try Again'}
          </Button>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 p-3 bg-red-100 rounded text-xs">
              <summary className="cursor-pointer font-medium">Error Details</summary>
              <pre className="mt-2 text-red-800 whitespace-pre-wrap">
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ProfileErrorBoundary;