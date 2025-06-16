
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ConversationTopic {
  id: string;
  topic: string;
  mentioned_at: string;
  frequency: number;
}

export const useConversationTopics = () => {
  const [topics, setTopics] = useState<ConversationTopic[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTopics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('conversation_topics')
        .select('*')
        .eq('user_id', user.id)
        .order('mentioned_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const addOrUpdateTopic = async (topicText: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if topic already exists
      const { data: existingTopic } = await supabase
        .from('conversation_topics')
        .select('*')
        .eq('user_id', user.id)
        .eq('topic', topicText)
        .single();

      if (existingTopic) {
        // Update frequency and timestamp
        const { error } = await supabase
          .from('conversation_topics')
          .update({
            frequency: existingTopic.frequency + 1,
            mentioned_at: new Date().toISOString()
          })
          .eq('id', existingTopic.id);

        if (error) throw error;
      } else {
        // Insert new topic
        const { error } = await supabase
          .from('conversation_topics')
          .insert({
            user_id: user.id,
            topic: topicText,
            frequency: 1
          });

        if (error) throw error;
      }

      // Refresh topics
      fetchTopics();
    } catch (error) {
      console.error('Error adding/updating topic:', error);
    }
  };

  const extractTopicsFromMessage = (message: string) => {
    // Simple topic extraction - look for key relationship themes
    const topicKeywords = [
      'communication', 'fighting', 'argument', 'love language', 'trust',
      'intimacy', 'support', 'stress', 'anxiety', 'future', 'family',
      'money', 'career', 'boundaries', 'respect', 'appreciation',
      'quality time', 'physical touch', 'words of affirmation',
      'acts of service', 'gifts', 'conflict', 'listening'
    ];

    const lowerMessage = message.toLowerCase();
    const foundTopics: string[] = [];

    topicKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        foundTopics.push(keyword);
      }
    });

    // Also look for phrases like "feeling..." or "worried about..."
    const feelingMatch = lowerMessage.match(/feeling\s+(\w+)/);
    if (feelingMatch) {
      foundTopics.push(`feeling ${feelingMatch[1]}`);
    }

    const worriedMatch = lowerMessage.match(/worried about\s+(\w+(?:\s+\w+)?)/);
    if (worriedMatch) {
      foundTopics.push(`worried about ${worriedMatch[1]}`);
    }

    return foundTopics;
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return {
    topics,
    loading,
    addOrUpdateTopic,
    extractTopicsFromMessage,
    refetchTopics: fetchTopics
  };
};
