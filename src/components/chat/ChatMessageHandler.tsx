
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
  const loading = pendingCount > 0;
  const speakResponseRef = useRef<((text: string) => void) | null>(null);
  const messageIdCounter = useRef(Date.now());
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

    // Batch state updates to prevent flickering
    setPendingCount(c => c + 1);
    setChatHistory(prev => deduplicateMessages([...prev, newUserMessage]));

    // Create history snapshot including the new user message for this request
    const historySnapshot = [...chatHistory, newUserMessage];

    const topics = extractTopicsFromMessage(userMessage);
    topics.forEach(topic => addOrUpdateTopic(topic));

    try {
      const context = AICoachEngine.buildPersonContext(profiles, demographicsData);
      
      // Check if this is a debug request
      const isDebugRequest = /what do you know|what information|profile data|what have you learned|debug/i.test(userMessage);
      
      // Use custom prompt for debug requests, otherwise let coordinator handle split prompts for caching
      const customPrompt = isDebugRequest 
        ? AICoachEngine.buildDebugPrompt(context, profiles, demographicsData)
        : undefined;
      
      const aiResponse = await AICoachEngine.getAIResponse(userMessage, context, historySnapshot, customPrompt);
      
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
      setPendingCount(c => Math.max(0, c - 1));
    }
  }, [canInteract, loading, generateMessageId, deduplicateMessages, chatHistory, extractTopicsFromMessage, addOrUpdateTopic, profiles, demographicsData, profileGoals, refreshSubscription]);

  const handleSpeakResponse = (speakFunction: (text: string) => void) => {
    speakResponseRef.current = speakFunction;
  };

  return {
    loading,
    sendMessage,
    handleSpeakResponse
  };
};
