
import { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Use any type to bypass TypeScript checking since the table was just created
      const { data, error } = await (supabase as any)
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConversation = async (messages: ChatMessage[], title?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || messages.length === 0) return;

      // Generate title from first user message if not provided
      const conversationTitle = title || 
        messages.find(m => m.type === 'user')?.content.substring(0, 50) + '...' || 
        'New Conversation';

      if (currentConversationId) {
        // Update existing conversation
        const { error } = await (supabase as any)
          .from('chat_conversations')
          .update({
            messages: JSON.stringify(messages),
            title: conversationTitle,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentConversationId);

        if (error) throw error;
      } else {
        // Create new conversation
        const { data, error } = await (supabase as any)
          .from('chat_conversations')
          .insert({
            user_id: user.id,
            title: conversationTitle,
            messages: JSON.stringify(messages)
          })
          .select()
          .single();

        if (error) throw error;
        setCurrentConversationId(data.id);
      }

      // Refresh conversations list
      fetchConversations();
    } catch (error) {
      console.error('Error saving conversation:', error);
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
    try {
      const { error } = await (supabase as any)
        .from('chat_conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;
      
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
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
    refetchConversations: fetchConversations
  };
};
