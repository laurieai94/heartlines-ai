
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/AIInsights";
import { chatReliabilityQueue } from "@/utils/chatQueue";
import { logError, logInfo, logWarn } from '@/utils/productionLogger';
import { batchedStorage } from "@/utils/batchedStorage";
import { RealtimeChannel } from "@supabase/supabase-js";

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

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
  
  // Track pending conversation ID to prevent race conditions
  const pendingConversationIdRef = useRef<string | null>(null);

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

      // Use existing ID, pending ID, or generate new one (prevents race condition)
      const conversationId = currentConversationId || 
        pendingConversationIdRef.current || 
        crypto.randomUUID();
      
      // Track pending ID if this is a new conversation
      if (!currentConversationId && !pendingConversationIdRef.current) {
        pendingConversationIdRef.current = conversationId;
      }

      // Prepare messages for storage
      const messagesForDB = JSON.stringify(messages);

      const conversationData = {
        id: conversationId,
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
        // Database save failed, adding to reliability queue
        chatReliabilityQueue.enqueue({
          id: conversationData.id,
          user_id: conversationData.user_id,
          title: conversationData.title,
          messages: messages,
          created_at: conversationData.created_at,
          updated_at: conversationData.updated_at
        });
      } else {
        // Success - update state and clear pending
        if (!currentConversationId) {
          setCurrentConversationId(conversationId);
        }
        pendingConversationIdRef.current = null;
        
        // Update local conversations state immediately for sidebar sync
        const conversationForState: ChatConversation = {
          id: conversationId,
          user_id: user.id,
          title: conversationTitle,
          messages: messages,
          created_at: conversationData.created_at,
          updated_at: conversationData.updated_at
        };
        setConversations(prev => {
          const without = prev.filter(c => c.id !== conversationId);
          return [conversationForState, ...without].sort(
            (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        });
      }

      // Always save to localStorage as backup
      const stored = batchedStorage.getItem('chat_conversations') || '[]';
      const localConversations = JSON.parse(stored);
      
      const conversationForStorage = {
        ...conversationData,
        messages: messages
      };

      const existingIndex = localConversations.findIndex((c: any) => c.id === conversationId);
      if (existingIndex >= 0) {
        localConversations[existingIndex] = conversationForStorage;
      } else {
        localConversations.unshift(conversationForStorage);
      }

      batchedStorage.setItem('chat_conversations', JSON.stringify(localConversations));

      // Always save plaintext to sessionStorage for immediate recovery
      sessionStorage.setItem('current_chat', JSON.stringify({
        conversationId: conversationData.id,
        messages: messages,
        timestamp: Date.now()
      }));

    } catch (error) {
      logError('Error saving conversation', error);
      // Fallback to localStorage only
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const stored = batchedStorage.getItem('chat_conversations') || '[]';
        const localConversations = JSON.parse(stored);
        const conversationData = {
          id: currentConversationId || pendingConversationIdRef.current || crypto.randomUUID(),
          user_id: user.id,
          title: title || 'New Conversation',
          messages,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        localConversations.unshift(conversationData);
        batchedStorage.setItem('chat_conversations', JSON.stringify(localConversations));
        
        if (!currentConversationId) {
          setCurrentConversationId(conversationData.id);
          pendingConversationIdRef.current = null;
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
      pendingConversationIdRef.current = null; // Clear pending when loading existing
      
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
      
      // If the most recent conversation is older than 24 hours, start fresh
      if (conversationAge > TWENTY_FOUR_HOURS) {
        setCurrentConversationId(null);
        pendingConversationIdRef.current = null;
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
    pendingConversationIdRef.current = null; // Clear pending ID
    sessionStorage.removeItem('current_chat');
    return [];
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Optimistically remove from state immediately
      setConversations(prev => prev.filter(c => c.id !== conversationId));

      // Delete from database
      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('id', conversationId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Database delete error:', error);
        // Refetch to restore state if delete failed
        await fetchConversations();
      }

      // Delete from localStorage
      const stored = batchedStorage.getItem('chat_conversations') || '[]';
      const localConversations = JSON.parse(stored);
      const filtered = localConversations.filter((c: any) => c.id !== conversationId);
      batchedStorage.setItem('chat_conversations', JSON.stringify(filtered));
      
      // Clear session if it's the current conversation
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
        pendingConversationIdRef.current = null;
        sessionStorage.removeItem('current_chat');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, []);

  // Real-time subscription for live updates
  useEffect(() => {
    let channel: RealtimeChannel | null = null;
    
    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      channel = supabase
        .channel('chat_conversations_realtime')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'chat_conversations',
            filter: `user_id=eq.${user.id}`
          }, 
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const newConv = payload.new as any;
              setConversations(prev => {
                // Don't add if already exists
                if (prev.some(c => c.id === newConv.id)) return prev;
                const formatted: ChatConversation = {
                  ...newConv,
                  messages: convertToMessages(newConv.messages)
                };
                return [formatted, ...prev];
              });
            } else if (payload.eventType === 'UPDATE') {
              const updatedConv = payload.new as any;
              setConversations(prev => {
                const formatted: ChatConversation = {
                  ...updatedConv,
                  messages: convertToMessages(updatedConv.messages)
                };
                const without = prev.filter(c => c.id !== updatedConv.id);
                return [formatted, ...without].sort(
                  (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                );
              });
            } else if (payload.eventType === 'DELETE') {
              const deletedId = (payload.old as any).id;
              setConversations(prev => prev.filter(c => c.id !== deletedId));
            }
          }
        )
        .subscribe();
    };
    
    setupSubscription();
    
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
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
