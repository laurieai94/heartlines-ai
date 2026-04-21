
import { useState, useRef, useCallback, useMemo } from 'react';
import { ChatMessage, ProfileData, DemographicsData } from '@/types/AIInsights';
import { UseProfileGoalsReturn } from '@/hooks/useProfileGoals';
import { AICoachEngine } from './AICoachEngine';
import { useConversationTopics } from '@/hooks/useConversationTopics';
import { useOptimizedSubscription } from '@/hooks/useOptimizedSubscription';
import { useRelationshipPatterns } from '@/hooks/useRelationshipPatterns';
import { detectPatterns, generateConversationSummary } from '@/services/patternDetectionService';
import { useAuth } from '@/contexts/AuthContext';
import { useProgressiveAccess } from '@/hooks/useProgressiveAccess';
import { MessageLimitError } from '@/services/aiService';

interface ChatMessageHandlerProps {
  profiles: ProfileData;
  demographicsData: DemographicsData;
  profileGoals?: UseProfileGoalsReturn;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  canInteract: boolean;
  isStartingNewConversation?: boolean;
}

export const useChatMessageHandler = ({
  profiles,
  demographicsData,
  profileGoals,
  chatHistory,
  setChatHistory,
  canInteract,
  isStartingNewConversation = false
}: ChatMessageHandlerProps) => {
  const [pendingCount, setPendingCount] = useState(0);
  const loading = pendingCount > 0;
  const speakResponseRef = useRef<((text: string) => void) | null>(null);
  const messageIdCounter = useRef(Date.now());
  const { extractTopicsFromMessage, addOrUpdateTopic } = useConversationTopics();
  const { refresh: refreshSubscription } = useOptimizedSubscription();
  const { formatCrossSessionMemory } = useRelationshipPatterns();
  const { user } = useAuth();
  const { openUpgradeModal } = useProgressiveAccess();

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

    // Use empty history if starting new conversation to prevent context bleed
    const effectiveHistory = isStartingNewConversation ? [] : chatHistory;
    const historySnapshot = [...effectiveHistory, newUserMessage];
    
    // Determine if this is the first message (for context gating)
    const isFirstMessage = effectiveHistory.length === 0;

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
      
      // Get cross-session memory with isFirstMessage flag for context gating
      const crossSessionMemory = formatCrossSessionMemory();
      const memoryWithFlag = isFirstMessage 
        ? `${crossSessionMemory}\n\n**THIS IS THE FIRST MESSAGE OF A NEW CONVERSATION. Treat as fresh topic. Do NOT assume this relates to past conversations unless user explicitly says so.**`
        : crossSessionMemory;
      
      const aiResponse = await AICoachEngine.getAIResponse(userMessage, context, historySnapshot, customPrompt, memoryWithFlag);
      
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

      // Detect patterns and generate summaries in the background
      if (user?.id) {
        const allMessages = [...historySnapshot, aiMessage];
        if (allMessages.length >= 5) {
          const conversationId = allMessages[0]?.id?.toString() || crypto.randomUUID();
          // Map messages to the format expected by pattern detection
          const mappedMessages = allMessages.map(msg => ({
            role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
            content: msg.content
          }));
          detectPatterns(conversationId, mappedMessages, user.id).catch(error =>
            console.error('Failed to detect patterns:', error)
          );
          generateConversationSummary(conversationId, mappedMessages, user.id).catch(error =>
            console.error('Failed to generate summary:', error)
          );
        }
      }

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
      
      // Check if this is a message limit error
      if (error instanceof MessageLimitError) {
        // Add a friendly "Kai overwhelmed" message to chat
        const limitMessage: ChatMessage = {
          id: generateMessageId(),
          type: 'ai',
          content: "hey, i've been loving our chats, but i've hit my message limit for now. 💕 upgrade to keep the conversation going—i've got more to share with you.",
          timestamp: new Date().toISOString()
        };
        setChatHistory(prev => deduplicateMessages([...prev, limitMessage]));
        
        // Refresh subscription to get latest count and open upgrade modal
        await refreshSubscription();
        openUpgradeModal('limit-reached');
        return;
      }
      
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        type: 'ai',
        content: error.message || "An unexpected error occurred. Please try again.",
        timestamp: new Date().toISOString(),
        isError: true,
        originalUserMessage: userMessage
      };
      setChatHistory(prev => deduplicateMessages([...prev, errorMessage]));
    } finally {
      setPendingCount(c => Math.max(0, c - 1));
    }
  }, [canInteract, loading, generateMessageId, deduplicateMessages, chatHistory, extractTopicsFromMessage, addOrUpdateTopic, profiles, demographicsData, profileGoals, refreshSubscription]);

  // Retry failed message - removes error message and resends
  const retryMessage = useCallback((errorMessageId: number, originalMessage: string) => {
    // Remove the error message from chat history
    setChatHistory(prev => prev.filter(msg => msg.id !== errorMessageId));
    // Resend the original message
    sendMessage(originalMessage);
  }, [setChatHistory, sendMessage]);

  const handleSpeakResponse = (speakFunction: (text: string) => void) => {
    speakResponseRef.current = speakFunction;
  };

  return {
    loading,
    sendMessage,
    retryMessage,
    handleSpeakResponse
  };
};
