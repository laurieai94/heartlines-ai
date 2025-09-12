
import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { ChatMessage, ProfileData, DemographicsData } from '@/types/AIInsights';
import { UseProfileGoalsReturn } from '@/hooks/useProfileGoals';
import { AICoachEngine } from '../AICoachEngine';
import { useConversationTopics } from '@/hooks/useConversationTopics';
import { useOptimizedSubscription } from '@/hooks/useOptimizedSubscription';
import { logger } from '@/utils/logger';

interface ChatMessageHandlerProps {
  profiles: ProfileData;
  demographicsData: DemographicsData;
  profileGoals?: UseProfileGoalsReturn;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  canInteract: boolean;
}

export const useChatMessageHandler = ({
  profiles,
  demographicsData,
  profileGoals,
  chatHistory,
  setChatHistory,
  canInteract
}: ChatMessageHandlerProps) => {
  const [loading, setLoading] = useState(false);
  const speakResponseRef = useRef<((text: string) => void) | null>(null);
  const messageIdCounter = useRef(Date.now());
  const requestTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const activeRequestIdRef = useRef<string | null>(null);
  const { extractTopicsFromMessage, addOrUpdateTopic } = useConversationTopics();
  const { refresh: refreshSubscription } = useOptimizedSubscription();

  // Debug logging for loading state changes
  useEffect(() => {
    logger.debug(`Loading state changed: ${loading}`);
  }, [loading]);

  // Cleanup on unmount - reset any stuck loading state
  useEffect(() => {
    return () => {
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
      }
      
      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Force reset loading state on unmount
      setLoading(false);
      activeRequestIdRef.current = null;
      logger.debug('ChatMessageHandler unmounted - reset loading state');
    };
  }, []);

  // Stable ID generation to prevent duplicate messages
  const generateMessageId = useCallback(() => {
    return ++messageIdCounter.current;
  }, []);

  // Memoized message deduplication
  const deduplicateMessages = useCallback((messages: ChatMessage[]): ChatMessage[] => {
    const seen = new Set<number>();
    return messages.filter(msg => {
      if (seen.has(msg.id)) return false;
      seen.add(msg.id);
      return true;
    });
  }, []);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!canInteract || loading) {
      logger.debug('Cannot send message - not interactive or loading');
      return; // Don't send while AI is thinking
    }

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Prevent duplicate requests
    if (activeRequestIdRef.current) {
      logger.debug('Ignoring message - request already in progress');
      return;
    }

    activeRequestIdRef.current = requestId;
    logger.debug(`Starting message request ${requestId}: "${userMessage.substring(0, 50)}..."`);

    const newUserMessage: ChatMessage = {
      id: generateMessageId(),
      type: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };

    // Set loading state and update chat history
    setLoading(true);
    setChatHistory(prev => deduplicateMessages([...prev, newUserMessage]));

    // Set timeout to prevent infinite loading (30 seconds)
    requestTimeoutRef.current = setTimeout(() => {
      logger.error(`Request ${requestId} timed out - forcing loading state reset`);
      setLoading(false);
      activeRequestIdRef.current = null;
    }, 30000);

    // Create history snapshot including the new user message for this request
    const historySnapshot = [...chatHistory, newUserMessage];

    const topics = extractTopicsFromMessage(userMessage);
    topics.forEach(topic => addOrUpdateTopic(topic));

    try {
      // Cancel any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();
      
      const context = AICoachEngine.buildPersonContext(profiles, demographicsData);
      
      // Check if this is a debug request
      const isDebugRequest = /what do you know|what information|profile data|what have you learned|debug/i.test(userMessage);
      
      let conversationalPrompt;
      if (isDebugRequest) {
        // Use debug prompt that lists all available information
        conversationalPrompt = AICoachEngine.buildDebugPrompt(context, profiles, demographicsData);
      } else {
        conversationalPrompt = AICoachEngine.buildConversationalPrompt(context, historySnapshot);
        
        // Enhance with goals if available
        if (profileGoals?.hasGoals) {
          const { GoalsBuilder } = await import('@/utils/prompt/goalsBuilder');
          const goalsInsights = GoalsBuilder.buildGoalsInsights(
            profileGoals.derivedGoals,
            profileGoals.partnerGoals,
            profileGoals.goalsSummary,
            profileGoals.priorityChallenges
          );
          conversationalPrompt += goalsInsights;
        }
      }
      
      const aiResponse = await AICoachEngine.getAIResponse(userMessage, context, historySnapshot, conversationalPrompt);
      logger.debug(`Request ${requestId} completed successfully`);
      
      const aiTopics = extractTopicsFromMessage(aiResponse);
      aiTopics.forEach(topic => addOrUpdateTopic(topic));
      
      const aiMessage: ChatMessage = {
        id: generateMessageId(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      // Single batched update with deduplication
      setChatHistory(prev => deduplicateMessages([...prev, aiMessage]));

      // Refresh subscription data to update usage count
      try {
        await refreshSubscription();
      } catch (err) {
        logger.warn('Failed to refresh subscription after message:', err);
      }

      if (speakResponseRef.current) {
        speakResponseRef.current(aiResponse);
      }
      
    } catch (error) {
      logger.error(`Request ${requestId} failed:`, error);
      
      // Handle different error types with user-friendly messages
      let errorContent = "An unexpected error occurred. Please try again.";
      
      if (error.name === 'AbortError') {
        logger.debug(`Request ${requestId} was cancelled`);
        return; // Don't show error for cancelled requests
      } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        errorContent = "Authentication error. Please try refreshing the page or signing in again.";
      } else if (error.message?.includes('Network') || error.message?.includes('fetch')) {
        errorContent = "Connection error. Please check your internet connection and try again.";
      } else if (error.message?.includes('Rate limit')) {
        errorContent = "You've reached your message limit. Please try again later or upgrade your plan.";
      } else if (error.message) {
        errorContent = error.message;
      }
      
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        type: 'ai',
        content: errorContent,
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => deduplicateMessages([...prev, errorMessage]));
    } finally {
      // Clear timeout and reset state
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
        requestTimeoutRef.current = null;
      }
      
      // Clean up abort controller
      if (abortControllerRef.current) {
        abortControllerRef.current = null;
      }
      
      // Reset loading state and clear active request
      setLoading(false);
      activeRequestIdRef.current = null;
      logger.debug(`Request ${requestId} finished - cleaning up`);
    }
  }, [canInteract, loading, generateMessageId, deduplicateMessages, chatHistory, extractTopicsFromMessage, addOrUpdateTopic, profiles, demographicsData, profileGoals, refreshSubscription]);

  const handleSpeakResponse = (speakFunction: (text: string) => void) => {
    speakResponseRef.current = speakFunction;
  };

  // Manual reset function for emergency cases
  const resetLoadingState = useCallback(() => {
    logger.debug('Manually resetting loading state');
    setLoading(false);
    activeRequestIdRef.current = null;
    
    if (requestTimeoutRef.current) {
      clearTimeout(requestTimeoutRef.current);
      requestTimeoutRef.current = null;
    }
    
    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    loading,
    sendMessage,
    handleSpeakResponse,
    resetLoadingState
  };
};
