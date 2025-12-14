import React, { memo, useEffect, useState, useCallback } from "react";
import { ChatMessage } from "@/types/AIInsights";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, Heart, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { BRAND } from "@/branding";
import { useOptimizedMobile } from "@/hooks/useOptimizedMobile";

interface AIChatMessageProps {
  message: ChatMessage;
  userAvatarUrl?: string;
  userName?: string;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
  isLoading?: boolean;
  onRetry?: () => void;
}

const AUTO_RETRY_SECONDS = 30;

const AIChatMessage = memo(({ message, userAvatarUrl, userName, isFirstInGroup = true, isLastInGroup = true, isLoading = false, onRetry }: AIChatMessageProps) => {
  const isUser = message.type === 'user';
  const isError = message.isError;
  const { isMobile } = useOptimizedMobile();
  const [countdown, setCountdown] = useState(AUTO_RETRY_SECONDS);
  const [autoRetryEnabled, setAutoRetryEnabled] = useState(true);
  
  // Format time to show only hours and minutes
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Auto-retry countdown effect
  useEffect(() => {
    if (!isError || !onRetry || !autoRetryEnabled) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onRetry();
          return AUTO_RETRY_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isError, onRetry, autoRetryEnabled]);

  // Handle manual retry
  const handleRetry = useCallback(() => {
    setAutoRetryEnabled(false);
    onRetry?.();
  }, [onRetry]);

  // Cancel auto-retry
  const cancelAutoRetry = useCallback(() => {
    setAutoRetryEnabled(false);
  }, []);

  // Performance monitoring - development only
  useEffect(() => {
    if (import.meta.env.PROD || !isMobile) return;
    
    const renderStart = performance.now();
    
    requestAnimationFrame(() => {
      const renderTime = performance.now() - renderStart;
      if (renderTime > 16) {
        console.warn('[Mobile Message Slow Render]:', {
          messageId: message.id,
          renderTime: renderTime.toFixed(2) + 'ms',
          messageLength: message.content.length
        });
      }
    });
  }, [message.id, isMobile, message.content.length]);

  
  return (
    <div className={`${isMobile ? 'px-3' : 'md:max-w-3xl lg:max-w-4xl md:mx-auto md:px-6'}`} data-message-container>
      <div 
        className={`flex overflow-visible ${isMobile ? 'gap-2' : 'gap-3'} ${isMobile ? (isLastInGroup ? 'mb-2' : 'mb-1') : 'mb-2 md:mb-3'} ${isUser ? 'flex-row-reverse' : 'flex-row'} group ${
          !isUser ? 'animate-[slide-up_0.3s_cubic-bezier(0.16,1,0.3,1)]' : 'animate-fade-in'
        }`}
        role="listitem"
        aria-label={`${isUser ? (userName || 'User') : 'kai'} message at ${formatTime(message.timestamp)}`}
      >
      {/* Avatar Container - Show only for first message in group on mobile */}
      <div className="flex-shrink-0 overflow-visible">
        <div className={`relative overflow-visible ${isMobile ? 'w-[60px] h-[60px]' : 'w-[64px] h-[64px]'} md:w-[68px] md:h-[68px] ${isMobile && !isFirstInGroup ? 'invisible' : ''} flex items-center justify-center`}>
          {/* Subtle glow for avatars */}
          <div className={`absolute inset-0 rounded-full ${
            isMobile ? 'blur-[2px] opacity-15' : 'blur-sm opacity-25 drop-shadow-lg'
          } ${
            isUser 
              ? isMobile 
                ? 'bg-gradient-to-r from-coral-400 to-orange-400' 
                : 'bg-gradient-to-r from-coral-300 to-orange-300'
              : isError
                ? 'bg-gradient-to-r from-amber-400 to-orange-400'
                : isMobile 
                  ? 'bg-gradient-to-r from-pink-400 to-coral-400' 
                  : 'bg-gradient-to-r from-coral-300 to-burgundy-400'
          } ${
            !isUser && isLoading ? 'animate-pulse' : ''
          }`}></div>
          
          <Avatar className={`relative z-10 shadow-lg drop-shadow-lg ${isMobile ? 'w-[36px] h-[36px] avatar-mobile' : 'w-[40px] h-[40px]'} md:w-[44px] md:h-[44px] md:border-2 md:border-white ${
            isUser 
              ? 'bg-gradient-to-br from-coral-400 to-orange-400' 
              : isError
                ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                : 'bg-gradient-to-br from-coral-400 to-burgundy-500'
          } ${
            !isUser && isLoading ? 'ring-4 ring-pink-400/40 animate-pulse' : ''
          }`}>
            {isUser && userAvatarUrl ? (
              <AvatarImage src={userAvatarUrl} alt={userName || 'User'} className="object-cover" loading="eager" fetchPriority="high" />
            ) : isUser ? (
              <AvatarFallback 
                className="bg-gradient-to-br from-coral-400 to-orange-400 text-white text-base md:text-lg font-medium uppercase"
                style={{
                  fontFamily: "'Shrikhand', cursive"
                }}
              >
                {userName ? userName.charAt(0).toUpperCase() : <User className="w-4 h-4 md:w-4 md:h-4" />}
              </AvatarFallback>
            ) : isError ? (
              <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                <AlertCircle className="w-4 h-4 md:w-4 md:h-4" />
              </AvatarFallback>
            ) : (
              <>
                <AvatarImage 
                  src={BRAND.coach.avatarSrc} 
                  alt={BRAND.coach.name} 
                  className="object-cover"
                  loading="eager" 
                  decoding="async"
                  fetchPriority="high"
                />
                <AvatarFallback delayMs={Infinity} className="bg-gradient-to-br from-coral-400 to-burgundy-500 text-white text-sm md:text-xs font-medium">
                  <Heart className="w-4 h-4 md:w-4 md:h-4" />
                </AvatarFallback>
              </>
            )}
          </Avatar>
        </div>
      </div>

      {/* Message Bubble */}
      <div className={`flex flex-col ${
        isMobile 
          ? (isFirstInGroup ? 'max-w-[85%]' : 'max-w-[88%]') 
          : 'max-w-[80%]'
      } ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`
          px-2.5 py-1.5 md:px-3 md:py-2 rounded-2xl
          ${isUser
            ? 'text-white rounded-br-lg border-2 border-coral-400/70 ring-1 ring-coral-400/30 bg-white/5 backdrop-blur-md md:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_4px_16px_rgba(251,146,60,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]'
            : isError
              ? 'text-white rounded-bl-lg border-2 border-amber-400/70 ring-1 ring-amber-400/30 bg-amber-900/20 backdrop-blur-md'
              : 'text-white rounded-bl-lg border-2 border-pink-400/70 ring-1 ring-pink-400/30 bg-white/5 backdrop-blur-md md:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]'
          }
          transition-all duration-300 md:group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] group-hover:scale-[1.01]
        `}
      >
          <div className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap font-light lowercase drop-shadow-sm message-text">
            {message.content}
          </div>
          
          {/* Retry UI for error messages */}
          {isError && onRetry && (
            <div className="mt-3 pt-3 border-t border-amber-400/30">
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleRetry}
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-600 text-white gap-2 h-8"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  retry now
                </Button>
                
                {autoRetryEnabled && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-200/70">
                      auto-retry in {countdown}s
                    </span>
                    <button
                      onClick={cancelAutoRetry}
                      className="text-xs text-amber-300/60 hover:text-amber-200 underline"
                    >
                      cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Timestamp - Only show for last message in group */}
        {(isLastInGroup || !isMobile) && (
          <p className={`text-xs md:text-xs ${isMobile ? 'text-pink-200/75' : 'text-pink-200/50'} mt-1 px-1 font-light ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTime(message.timestamp)}
          </p>
        )}
      </div>
    </div>
    </div>
  );
});

AIChatMessage.displayName = 'AIChatMessage';

export default AIChatMessage;