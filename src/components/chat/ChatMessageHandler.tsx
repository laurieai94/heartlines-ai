
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
  const [pendingCount, setPendingCount] = useState(0);
  const loading = pendingCount > 0;
  const speakResponseRef = useRef<((text: string) => void) | null>(null);
  const messageIdCounter = useRef(Date.now());
  const requestTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { extractTopicsFromMessage, addOrUpdateTopic } = useConversationTopics();
  const { refresh: refreshSubscription } = useOptimizedSubscription();

  // Debug logging for loading state changes
  useEffect(() => {
    logger.debug(`Loading state changed: ${loading} (pendingCount: ${pendingCount})`);
  }, [loading, pendingCount]);

  // Cleanup on unmount - reset any stuck loading state
  useEffect(() => {
    return () => {
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
      }
      // Force reset loading state on unmount
      setPendingCount(0);
      logger.debug('ChatMessageHandler unmounted - reset loading state');
    };
  }, []);

  // Safe pending count updater with logging
  const updatePendingCount = useCallback((updater: (prev: number) => number) => {
    setPendingCount(prev => {
      const newValue = updater(prev);
      logger.debug(`Pending count: ${prev} → ${newValue}`);
      return Math.max(0, newValue); // Ensure it never goes negative
    });
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

    const requestId = Date.now();
    logger.debug(`Starting message request ${requestId}: "${userMessage.substring(0, 50)}..."`);

    const newUserMessage: ChatMessage = {
      id: generateMessageId(),
      type: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };

    // Batch state updates to prevent flickering
    updatePendingCount(c => c + 1);
    setChatHistory(prev => deduplicateMessages([...prev, newUserMessage]));

    // Set timeout to prevent infinite loading (30 seconds)
    requestTimeoutRef.current = setTimeout(() => {
      logger.error(`Request ${requestId} timed out - forcing loading state reset`);
      updatePendingCount(() => 0);
    }, 30000);

    // Create history snapshot including the new user message for this request
    const historySnapshot = [...chatHistory, newUserMessage];

    const topics = extractTopicsFromMessage(userMessage);
    topics.forEach(topic => addOrUpdateTopic(topic));

    try {
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
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        type: 'ai',
        content: error.message || "An unexpected error occurred. Please try again.",
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => deduplicateMessages([...prev, errorMessage]));
    } finally {
      // Clear timeout and decrement pending count
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
        requestTimeoutRef.current = null;
      }
      updatePendingCount(c => c - 1);
      logger.debug(`Request ${requestId} finished - cleaning up`);
    }
  }, [canInteract, loading, generateMessageId, deduplicateMessages, chatHistory, extractTopicsFromMessage, addOrUpdateTopic, profiles, demographicsData, profileGoals, refreshSubscription, updatePendingCount]);

  const handleSpeakResponse = (speakFunction: (text: string) => void) => {
    speakResponseRef.current = speakFunction;
  };

  // Manual reset function for emergency cases
  const resetLoadingState = useCallback(() => {
    logger.debug('Manually resetting loading state');
    updatePendingCount(() => 0);
    if (requestTimeoutRef.current) {
      clearTimeout(requestTimeoutRef.current);
      requestTimeoutRef.current = null;
    }
  }, [updatePendingCount]);

  return {
    loading,
    sendMessage,
    handleSpeakResponse,
    resetLoadingState
  };
};
