
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
        .limit(20);

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
    // Performance guard - limit message length to prevent excessive processing
    if (message.length > 5000) {
      console.warn('Message too long for topic extraction, truncating');
      message = message.substring(0, 5000);
    }

    // Enhanced topic extraction with more relationship themes
    const topicKeywords = [
      'communication', 'fighting', 'argument', 'love language', 'trust',
      'intimacy', 'support', 'stress', 'anxiety', 'future', 'family',
      'money', 'career', 'boundaries', 'respect', 'appreciation',
      'quality time', 'physical touch', 'words of affirmation',
      'acts of service', 'gifts', 'conflict', 'listening', 'understanding',
      'jealousy', 'insecurity', 'commitment', 'independence', 'space',
      'romance', 'passion', 'friendship', 'connection', 'distance',
      'expectations', 'goals', 'values', 'priorities', 'compromise'
    ];

    const lowerMessage = message.toLowerCase();
    const foundTopics: string[] = [];

    // Safe keyword extraction
    topicKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        foundTopics.push(keyword);
      }
    });

    // Safe phrase extraction using matchAll instead of while loops
    const feelingPatterns = [
      /feeling\s+(\w+)/g,
      /feel\s+(\w+)/g,
      /worried about\s+([\w\s]{1,20})/g,
      /struggling with\s+([\w\s]{1,20})/g,
      /confused about\s+([\w\s]{1,20})/g,
      /upset about\s+([\w\s]{1,20})/g
    ];

    try {
      feelingPatterns.forEach(pattern => {
        // Use Array.from with matchAll to safely extract all matches
        const matches = Array.from(lowerMessage.matchAll(pattern));
        matches.slice(0, 10).forEach(match => { // Limit to 10 matches per pattern
          if (match[1] && match[1].trim().length > 2) {
            foundTopics.push(match[1].trim());
          }
        });
      });
    } catch (error) {
      console.error('Error extracting topics from patterns:', error);
    }

    // Remove duplicates and filter out very short or common words
    const uniqueTopics = [...new Set(foundTopics)].filter(topic => 
      topic.length > 2 && 
      !['the', 'and', 'but', 'for', 'with', 'you', 'are', 'that', 'this'].includes(topic)
    );

    // Limit total topics to prevent excessive processing
    return uniqueTopics.slice(0, 20);
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
