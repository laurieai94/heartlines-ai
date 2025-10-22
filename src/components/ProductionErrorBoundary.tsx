import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Home, Smartphone } from 'lucide-react';
import BrandMark from '@/components/BrandMark';
import { toast } from 'sonner';
import { logError } from '@/utils/productionLogger';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

interface ProductionErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error | null; retry: () => void; errorId: string | null }>;
  level?: 'app' | 'page' | 'component';
  name?: string;
  showToast?: boolean;
  autoRecover?: boolean;
  autoRecoverDelay?: number;
}

class ProductionErrorBoundary extends Component<ProductionErrorBoundaryProps, ErrorBoundaryState> {
  private retryCount = 0;
  private maxRetries = 3;
  private autoRecoverTimeout?: NodeJS.Timeout;

  constructor(props: ProductionErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorId: null 
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { 
      hasError: true, 
      error, 
      errorId 
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { level = 'component', name = 'Unknown' } = this.props;
    
    // Log error with context
    logError(
      `${level} error in ${name}`,
      error,
      {
        component: name,
        level,
        retryCount: this.retryCount,
        errorId: this.state.errorId,
        stack: error.stack?.slice(0, 500), // Truncate for storage
        componentStack: errorInfo.componentStack?.slice(0, 300)
      }
    );

    // Show user-friendly toast for component-level errors
    if (this.props.showToast && level === 'component') {
      toast.error(`${name} temporarily unavailable. Please try refreshing.`);
    }

    // Auto-recovery for component-level errors
    if (this.props.autoRecover && level === 'component') {
      const delay = this.props.autoRecoverDelay || 3000;
      this.autoRecoverTimeout = setTimeout(() => {
        this.retry();
      }, delay);
    }
  }

  componentWillUnmount() {
    if (this.autoRecoverTimeout) {
      clearTimeout(this.autoRecoverTimeout);
    }
  }

  retry = () => {
    if (this.autoRecoverTimeout) {
      clearTimeout(this.autoRecoverTimeout);
    }

    this.retryCount++;
    
    // Force page reload if too many retries
    if (this.retryCount >= this.maxRetries) {
      window.location.reload();
      return;
    }

    this.setState({ 
      hasError: false, 
      error: null, 
      errorId: null 
    });
  };

  renderAppLevelError() {
    return (
      <div className="min-h-screen bg-burgundy-800 flex items-center justify-center p-6">
        <div className="max-w-md mx-auto text-center">
          <BrandMark size="md" className="mx-auto mb-6" />
          
          <h1 className="text-2xl font-thin text-white mb-4">
            Something went wrong
          </h1>
          
          <p className="text-gray-300 mb-8 leading-relaxed">
            We're having trouble loading the page. This might be a temporary issue.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={this.retry}
              className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-6 py-3 rounded-full border-0"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-6 py-3 rounded-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  renderMobileError() {
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
            <Button onClick={this.retry} className="w-full" size="lg">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  renderComponentError() {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center bg-destructive/5 rounded-lg border border-destructive/20">
        <div className="w-12 h-12 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <RefreshCw className="w-6 h-6 text-destructive" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          {this.props.name || 'Component'} Unavailable
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          This section is temporarily unavailable.
        </p>
        <Button onClick={this.retry} size="sm" variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback component
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent 
            error={this.state.error} 
            retry={this.retry}
            errorId={this.state.errorId}
          />
        );
      }

      // Built-in fallback based on error level
      const { level = 'component' } = this.props;
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

      if (level === 'app') {
        return isMobile ? this.renderMobileError() : this.renderAppLevelError();
      }

      if (level === 'page') {
        return isMobile ? this.renderMobileError() : this.renderAppLevelError();
      }

      return this.renderComponentError();
    }

    return this.props.children;
  }
}

export default ProductionErrorBoundary;