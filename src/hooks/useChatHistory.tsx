
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/AIInsights";
import { useAuth } from "@/contexts/AuthContext";

export interface ChatConversation {
  id: string;
  user_id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export const useChatHistory = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const conversationsWithParsedMessages = data.map(conv => ({
        ...conv,
        messages: typeof conv.messages === 'string' ? JSON.parse(conv.messages) : conv.messages
      }));

      setConversations(conversationsWithParsedMessages);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      // Fallback to localStorage for backward compatibility
      const stored = localStorage.getItem('chat_conversations') || '[]';
      const localConversations = JSON.parse(stored);
      setConversations(localConversations);
    } finally {
      setLoading(false);
    }
  };

  const saveConversation = async (messages: ChatMessage[], title?: string) => {
    if (!user || messages.length === 0) return;

    try {
      const conversationTitle = title || 
        messages.find(m => m.type === 'user')?.content.substring(0, 50) + '...' || 
        'New Conversation';

      const conversationData = {
        user_id: user.id,
        title: conversationTitle,
        messages: JSON.stringify(messages),
        updated_at: new Date().toISOString()
      };

      if (currentConversationId) {
        // Update existing conversation
        const { data, error } = await supabase
          .from('chat_conversations')
          .update(conversationData)
          .eq('id', currentConversationId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;

        setConversations(prev => prev.map(conv => 
          conv.id === currentConversationId 
            ? { ...data, messages: typeof data.messages === 'string' ? JSON.parse(data.messages) : data.messages }
            : conv
        ));
      } else {
        // Create new conversation
        const { data, error } = await supabase
          .from('chat_conversations')
          .insert({
            ...conversationData,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;

        const newConversation = {
          ...data,
          messages: typeof data.messages === 'string' ? JSON.parse(data.messages) : data.messages
        };

        setConversations(prev => [newConversation, ...prev]);
        setCurrentConversationId(data.id);
      }
    } catch (error) {
      console.error('Error saving conversation:', error);
      // Fallback to localStorage
      const conversation = {
        id: currentConversationId || Date.now().toString(),
        user_id: user.id,
        title: title || 'New Conversation',
        messages,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

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
    }
  };

  const loadConversation = (conversationId: string): ChatMessage[] => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversationId(conversationId);
      return typeof conversation.messages === 'string' 
        ? JSON.parse(conversation.messages) 
        : conversation.messages;
    }
    return [];
  };

  const startNewConversation = () => {
    setCurrentConversationId(null);
    return [];
  };

  const deleteConversation = async (conversationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('id', conversationId)
        .eq('user_id', user.id);

      if (error) throw error;

      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      // Fallback to localStorage
      const stored = localStorage.getItem('chat_conversations') || '[]';
      const conversations = JSON.parse(stored);
      const filtered = conversations.filter((c: any) => c.id !== conversationId);
      localStorage.setItem('chat_conversations', JSON.stringify(filtered));
      
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
      }
      
      fetchConversations();
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  return {
    conversations,
    currentConversationId,
    loading,
    saveConversation,
    loadConversation,
    startNewConversation,
    deleteConversation,
    refetchConversations: fetchConversations
  };
};
