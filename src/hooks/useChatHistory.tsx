
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/AIInsights";
import { chatReliabilityQueue } from "@/utils/chatQueue";
import { logError, logInfo, logWarn } from '@/utils/productionLogger';
import { batchedStorage } from "@/utils/batchedStorage";
// Chat reliability queue removed logger import for performance

const TWELVE_HOURS = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

export interface ChatConversation {
  id: string;
  user_id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

// Type guard to check if an object is a valid ChatMessage
const isChatMessage = (obj: any): obj is ChatMessage => {
  return obj && 
    typeof obj.id === 'number' && 
    typeof obj.type === 'string' && 
    (obj.type === 'user' || obj.type === 'ai') &&
    typeof obj.content === 'string' && 
    typeof obj.timestamp === 'string';
};

// Safe conversion function for messages
const convertToMessages = (data: any): ChatMessage[] => {
  if (!data) return [];
  
  // If it's a string, try to parse it
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return convertToMessages(parsed);
    } catch {
      return [];
    }
  }
  
  // If it's an array, validate each item
  if (Array.isArray(data)) {
    return data.filter(isChatMessage);
  }
  
  return [];
};

export const useChatHistory = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Try to fetch from database first
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        logError('Database fetch error, falling back to localStorage', error);
        // Fallback to localStorage
        const stored = batchedStorage.getItem('chat_conversations') || '[]';
        const localConversations = JSON.parse(stored).filter((c: any) => c.user_id === user.id);
        setConversations(localConversations);
      } else {
        // Convert database format to our interface using safe conversion
        const formattedConversations: ChatConversation[] = (data || []).map(conv => ({
          ...conv,
          messages: convertToMessages(conv.messages)
        }));
        setConversations(formattedConversations);
        // Also store in localStorage as backup
        batchedStorage.setItem('chat_conversations', JSON.stringify(formattedConversations));
      }
    } catch (error) {
      logError('Error fetching conversations', error);
      // Final fallback to localStorage
      try {
        const stored = batchedStorage.getItem('chat_conversations') || '[]';
        const conversations = JSON.parse(stored);
        setConversations(conversations);
      } catch {
        setConversations([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveConversation = async (messages: ChatMessage[], title?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || messages.length === 0) return;

      const conversationTitle = title || 
        messages.find(m => m.type === 'user')?.content.substring(0, 50) + '...' || 
        'New Conversation';

      // Prepare messages for storage
      const messagesForDB = JSON.stringify(messages);

      const conversationData = {
        id: currentConversationId || crypto.randomUUID(),
        user_id: user.id,
        title: conversationTitle,
        messages: messagesForDB,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Save to database with reliability queue backup
      const { error: dbError } = await supabase
        .from('chat_conversations')
        .upsert({
          id: conversationData.id,
          user_id: conversationData.user_id,
          title: conversationData.title,
          messages: conversationData.messages,
          created_at: conversationData.created_at,
          updated_at: conversationData.updated_at
        }, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });

      if (dbError) {
        // Database save failed, adding to reliability queue (logging removed for performance)
        // Add to reliability queue for later retry
        chatReliabilityQueue.enqueue({
          id: conversationData.id,
          user_id: conversationData.user_id,
          title: conversationData.title,
          messages: messages, // Use original messages, not encrypted version
          created_at: conversationData.created_at,
          updated_at: conversationData.updated_at
        });
      } else {
        // Chat conversation saved to database successfully (logging removed for performance)
      }

      // Always save to localStorage as backup
      const stored = batchedStorage.getItem('chat_conversations') || '[]';
      const conversations = JSON.parse(stored);
      
      const conversationForStorage = {
        ...conversationData,
        messages: messages
      };

      if (currentConversationId) {
        const index = conversations.findIndex((c: any) => c.id === currentConversationId);
        if (index >= 0) {
          conversations[index] = conversationForStorage;
        } else {
          conversations.push(conversationForStorage);
        }
      } else {
        conversations.push(conversationForStorage);
        setCurrentConversationId(conversationData.id);
      }

      batchedStorage.setItem('chat_conversations', JSON.stringify(conversations));

      // Optimistically update in-memory state so sidebar reflects immediately
      setConversations((prev) => {
        const without = prev.filter((c) => c.id !== conversationData.id);
        return [{ ...conversationForStorage }, ...without];
      });

      // Always save plaintext to sessionStorage for immediate recovery
      sessionStorage.setItem('current_chat', JSON.stringify({
        conversationId: conversationData.id,
        messages: messages, // Always plaintext in session
        timestamp: Date.now()
      }));

    } catch (error) {
      logError('Error saving conversation', error);
      // Fallback to localStorage only
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const stored = batchedStorage.getItem('chat_conversations') || '[]';
        const conversations = JSON.parse(stored);
        const conversationData = {
          id: currentConversationId || crypto.randomUUID(),
          user_id: user.id,
          title: title || 'New Conversation',
          messages,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        conversations.push(conversationData);
        batchedStorage.setItem('chat_conversations', JSON.stringify(conversations));
        
        if (!currentConversationId) {
          setCurrentConversationId(conversationData.id);
        }
      } catch (fallbackError) {
        logError('Even localStorage save failed', fallbackError);
      }
    }
  };

  const loadConversation = async (conversationId: string): Promise<ChatMessage[]> => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversationId(conversationId);
      
      // Load and convert messages
      const messages = convertToMessages(conversation.messages);
      
      // Save decrypted messages to sessionStorage for quick recovery
      sessionStorage.setItem('current_chat', JSON.stringify({
        conversationId: conversationId,
        messages: messages,
        timestamp: Date.now()
      }));
      
      return messages;
    }
    return [];
  };

  const loadMostRecentConversation = (): ChatMessage[] => {
    // First check sessionStorage for immediate recovery
    try {
      const sessionChat = sessionStorage.getItem('current_chat');
      if (sessionChat) {
        const { conversationId, messages, timestamp } = JSON.parse(sessionChat);
        // Only use if less than 1 hour old
        if (Date.now() - timestamp < 3600000) {
          setCurrentConversationId(conversationId);
          return messages;
        }
      }
    } catch (error) {
      console.error('Error loading from sessionStorage:', error);
    }

    // Then check for most recent conversation
    if (conversations.length > 0) {
      const mostRecent = conversations[0];
      const conversationAge = Date.now() - new Date(mostRecent.updated_at).getTime();
      
      // If the most recent conversation is older than 12 hours, start fresh
      if (conversationAge > TWELVE_HOURS) {
        // Most recent conversation is older than 12 hours, starting fresh chat (logging removed for performance)
        setCurrentConversationId(null);
        sessionStorage.removeItem('current_chat');
        return [];
      }
      
      setCurrentConversationId(mostRecent.id);
      return convertToMessages(mostRecent.messages);
    }
    
    return [];
  };

  const startNewConversation = () => {
    setCurrentConversationId(null);
    sessionStorage.removeItem('current_chat');
    return [];
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Delete from database
      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('id', conversationId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Database delete error:', error);
      }

      // Delete from localStorage
      const stored = batchedStorage.getItem('chat_conversations') || '[]';
      const conversations = JSON.parse(stored);
      const filtered = conversations.filter((c: any) => c.id !== conversationId);
      batchedStorage.setItem('chat_conversations', JSON.stringify(filtered));
      
      // Clear session if it's the current conversation
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
        sessionStorage.removeItem('current_chat');
      }
      
      await fetchConversations();
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Listen for global refresh events
  useEffect(() => {
    const handleRefresh = async () => {
      await fetchConversations();
    };

    window.addEventListener('chat:refresh', handleRefresh);
    
    return () => {
      window.removeEventListener('chat:refresh', handleRefresh);
    };
  }, []);

  return {
    conversations,
    currentConversationId,
    loading,
    saveConversation,
    loadConversation,
    loadMostRecentConversation,
    startNewConversation,
    deleteConversation,
    refetchConversations: fetchConversations
  };
};
