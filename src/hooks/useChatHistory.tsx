
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/AIInsights";

export interface ChatConversation {
  id: string;
  user_id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export const useChatHistory = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Load current messages from localStorage on init
  useEffect(() => {
    const stored = localStorage.getItem('current_chat_messages');
    if (stored) {
      try {
        const messages = JSON.parse(stored);
        console.log('Loading messages from localStorage:', messages);
        setCurrentMessages(messages);
      } catch (error) {
        console.error('Error loading current messages:', error);
        setCurrentMessages([]);
      }
    }
  }, []);

  const fetchConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Load from localStorage for now
      const stored = localStorage.getItem('chat_conversations') || '[]';
      const conversations = JSON.parse(stored);
      setConversations(conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentMessages = useCallback(() => {
    return currentMessages;
  }, [currentMessages]);

  const updateCurrentMessages = useCallback((messages: ChatMessage[]) => {
    console.log('Updating current messages:', messages);
    setCurrentMessages(messages);
    // Persist to localStorage immediately
    try {
      localStorage.setItem('current_chat_messages', JSON.stringify(messages));
      console.log('Messages saved to localStorage');
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
    }
  }, []);

  const saveConversation = async (messages: ChatMessage[], title?: string) => {
    // Store in localStorage as fallback since database table doesn't exist
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || messages.length === 0) return;

      const conversationTitle = title || 
        messages.find(m => m.type === 'user')?.content.substring(0, 50) + '...' || 
        'New Conversation';

      const conversation = {
        id: currentConversationId || Date.now().toString(),
        user_id: user.id,
        title: conversationTitle,
        messages,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Store in localStorage for now
      const stored = localStorage.getItem('chat_conversations') || '[]';
      const conversations = JSON.parse(stored);
      
      if (currentConversationId) {
        const index = conversations.findIndex((c: any) => c.id === currentConversationId);
        if (index >= 0) {
          conversations[index] = conversation;
        } else {
          conversations.push(conversation);
        }
      } else {
        conversations.push(conversation);
        setCurrentConversationId(conversation.id);
      }

      localStorage.setItem('chat_conversations', JSON.stringify(conversations));
      setConversations(conversations);
      console.log('Conversation saved:', conversation);
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  const loadConversation = useCallback((conversationId: string): ChatMessage[] => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversationId(conversationId);
      const messages = typeof conversation.messages === 'string' 
        ? JSON.parse(conversation.messages) 
        : conversation.messages;
      console.log('Loading conversation:', conversationId, messages);
      setCurrentMessages(messages);
      localStorage.setItem('current_chat_messages', JSON.stringify(messages));
      return messages;
    }
    return [];
  }, [conversations]);

  const startNewConversation = useCallback(() => {
    console.log('Starting new conversation');
    setCurrentConversationId(null);
    setCurrentMessages([]);
    localStorage.removeItem('current_chat_messages');
    return [];
  }, []);

  const deleteConversation = async (conversationId: string) => {
    try {
      const stored = localStorage.getItem('chat_conversations') || '[]';
      const conversations = JSON.parse(stored);
      const filtered = conversations.filter((c: any) => c.id !== conversationId);
      localStorage.setItem('chat_conversations', JSON.stringify(filtered));
      
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
        setCurrentMessages([]);
        localStorage.removeItem('current_chat_messages');
      }
      
      fetchConversations();
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return {
    conversations,
    currentConversationId,
    loading,
    saveConversation,
    loadConversation,
    startNewConversation,
    deleteConversation,
    refetchConversations: fetchConversations,
    getCurrentMessages,
    updateCurrentMessages
  };
};
