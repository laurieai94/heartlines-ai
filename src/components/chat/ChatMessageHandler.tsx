
import { useState, useRef, useCallback, useMemo } from 'react';
import { ChatMessage, ProfileData, DemographicsData } from '@/types/AIInsights';
import { UseProfileGoalsReturn } from '@/hooks/useProfileGoals';
import { AICoachEngine } from '../AICoachEngine';
import { useConversationTopics } from '@/hooks/useConversationTopics';
import { useOptimizedSubscription } from '@/hooks/useOptimizedSubscription';

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
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const loading = pendingCount > 0;
  const speakResponseRef = useRef<((text: string) => void) | null>(null);
  const messageIdCounter = useRef(Date.now());
  const typingDelayRef = useRef<NodeJS.Timeout>();
  const cleanupTimeoutRef = useRef<NodeJS.Timeout>();
  const { extractTopicsFromMessage, addOrUpdateTopic } = useConversationTopics();
  const { refresh: refreshSubscription } = useOptimizedSubscription();

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
    if (!canInteract || loading) return; // Don't send while AI is thinking

    const newUserMessage: ChatMessage = {
      id: generateMessageId(),
      type: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };

    // Clear any existing timeouts
    if (typingDelayRef.current) {
      clearTimeout(typingDelayRef.current);
    }
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
    }

    // Batch state updates to prevent flickering
    setPendingCount(c => c + 1);
    setChatHistory(prev => deduplicateMessages([...prev, newUserMessage]));

    // Add delay before showing typing indicator to prevent flashing
    typingDelayRef.current = setTimeout(() => {
      setShowTypingIndicator(true);
    }, 500);

    // Safety cleanup in case response takes too long
    cleanupTimeoutRef.current = setTimeout(() => {
      console.warn('AI response took too long, cleaning up loading state');
      setPendingCount(0);
      setShowTypingIndicator(false);
    }, 30000); // 30 second timeout

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
        console.warn('Failed to refresh subscription after message:', err);
      }

      if (speakResponseRef.current) {
        speakResponseRef.current(aiResponse);
      }
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        type: 'ai',
        content: error.message || "An unexpected error occurred. Please try again.",
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => deduplicateMessages([...prev, errorMessage]));
    } finally {
      // Clear all timeouts and reset states
      if (typingDelayRef.current) {
        clearTimeout(typingDelayRef.current);
      }
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
      
      setPendingCount(c => Math.max(0, c - 1));
      setShowTypingIndicator(false);
    }
  }, [canInteract, loading, generateMessageId, deduplicateMessages, chatHistory, extractTopicsFromMessage, addOrUpdateTopic, profiles, demographicsData, profileGoals, refreshSubscription]);

  const handleSpeakResponse = (speakFunction: (text: string) => void) => {
    speakResponseRef.current = speakFunction;
  };

  return {
    loading,
    showTypingIndicator,
    sendMessage,
    handleSpeakResponse
  };
};
