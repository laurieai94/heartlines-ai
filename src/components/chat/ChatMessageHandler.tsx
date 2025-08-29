
import { useState, useRef } from 'react';
import { ChatMessage, ProfileData, DemographicsData } from '@/types/AIInsights';
import { AICoachEngine } from '../AICoachEngine';
import { useConversationTopics } from '@/hooks/useConversationTopics';
import { useOptimizedSubscription } from '@/hooks/useOptimizedSubscription';
import { performanceMonitor } from '@/utils/performanceMonitor';

interface ChatMessageHandlerProps {
  profiles: ProfileData;
  demographicsData: DemographicsData;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  canInteract: boolean;
}

export const useChatMessageHandler = ({
  profiles,
  demographicsData,
  chatHistory,
  setChatHistory,
  canInteract
}: ChatMessageHandlerProps) => {
  const [loading, setLoading] = useState(false);
  const speakResponseRef = useRef<((text: string) => void) | null>(null);
  const lastRefreshRef = useRef(0);
  const topicFlushTimeoutRef = useRef<NodeJS.Timeout>();
  const { extractTopicsFromMessage, addOrUpdateTopicsBatch } = useConversationTopics();
  const { refresh: refreshSubscription } = useOptimizedSubscription();

  const sendMessage = async (userMessage: string) => {
    if (!canInteract) return;

    performanceMonitor.mark('ai_request');

    const newUserMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, newUserMessage]);
    setLoading(true);

    // Extract topics from user message
    const userTopics = extractTopicsFromMessage(userMessage);

    try {
      const context = AICoachEngine.buildPersonContext(profiles, demographicsData);
      
      // Check if this is a debug request
      const isDebugRequest = /what do you know|what information|profile data|what have you learned|debug/i.test(userMessage);
      
      let conversationalPrompt;
      if (isDebugRequest) {
        // Use debug prompt that lists all available information
        conversationalPrompt = AICoachEngine.buildDebugPrompt(context, profiles, demographicsData);
      } else {
        conversationalPrompt = AICoachEngine.buildConversationalPrompt(context, chatHistory);
      }
      
      const aiResponse = await AICoachEngine.getAIResponse(userMessage, context, chatHistory, conversationalPrompt);
      
      performanceMonitor.measure('ai_request', 2000);
      
      // Extract topics from AI response
      const aiTopics = extractTopicsFromMessage(aiResponse);
      
      // Batch all topics together and flush after a delay
      const allTopics = [...userTopics, ...aiTopics];
      if (allTopics.length > 0) {
        if (topicFlushTimeoutRef.current) {
          clearTimeout(topicFlushTimeoutRef.current);
        }
        topicFlushTimeoutRef.current = setTimeout(() => {
          addOrUpdateTopicsBatch(allTopics).catch(err => 
            console.warn('Failed to update topics:', err)
          );
        }, 300);
      }
      
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      setChatHistory(prev => [...prev, aiMessage]);

      // Throttled subscription refresh (max once per minute)
      const now = Date.now();
      if (now - lastRefreshRef.current > 60000) {
        try {
          await refreshSubscription();
          lastRefreshRef.current = now;
        } catch (err) {
          console.warn('Failed to refresh subscription after message:', err);
        }
      }

      if (speakResponseRef.current) {
        speakResponseRef.current(aiResponse);
      }

      // Performance monitoring for render
      setTimeout(() => {
        performanceMonitor.measure('render_after_response', 150);
      }, 0);
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: error.message || "An unexpected error occurred. Please try again.",
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      performanceMonitor.mark('render_after_response');
    }
  };

  const handleSpeakResponse = (speakFunction: (text: string) => void) => {
    speakResponseRef.current = speakFunction;
  };

  return {
    loading,
    sendMessage,
    handleSpeakResponse
  };
};
