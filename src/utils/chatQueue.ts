// Chat message reliability queue for offline/failed saves
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/AIInsights";
import { logger } from "./logger";

interface QueuedChat {
  id: string;
  user_id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
  retryCount: number;
}

class ChatReliabilityQueue {
  private queue: QueuedChat[] = [];
  private isProcessing = false;
  private maxRetries = 3;
  private maxQueueSize = 50;
  private debounceTimer: number | null = null;

  constructor() {
    this.loadFromStorage();
    // Process queue on tab visibility change (user comes back online)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.processQueue();
      }
    });
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('chat_queue');
      if (stored) {
        this.queue = JSON.parse(stored);
        logger.info(`Loaded ${this.queue.length} items from chat queue`);
      }
    } catch (error) {
      logger.error('Failed to load chat queue from storage', error);
      this.queue = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('chat_queue', JSON.stringify(this.queue));
    } catch (error) {
      logger.error('Failed to save chat queue to storage', error);
    }
  }

  enqueue(conversationData: Omit<QueuedChat, 'retryCount'>) {
    // Cap queue size to prevent memory issues
    if (this.queue.length >= this.maxQueueSize) {
      this.queue.shift(); // Remove oldest item
      logger.warn('Chat queue at max size, removed oldest item');
    }

    const queueItem: QueuedChat = {
      ...conversationData,
      retryCount: 0
    };

    // Remove existing item with same ID if any
    this.queue = this.queue.filter(item => item.id !== queueItem.id);
    this.queue.push(queueItem);
    
    this.saveToStorage();
    logger.info('Added conversation to reliability queue', { id: queueItem.id });

    // Debounced processing to avoid spam
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = window.setTimeout(() => {
      this.processQueue();
    }, 1000);
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    logger.info(`Processing chat queue with ${this.queue.length} items`);

    const failedItems: QueuedChat[] = [];

    for (const item of this.queue) {
      try {
        const { error } = await supabase
          .from('chat_conversations')
          .upsert({
            id: item.id,
            user_id: item.user_id,
            title: item.title,
            messages: JSON.stringify(item.messages),
            created_at: item.created_at,
            updated_at: new Date().toISOString()
          }, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          });

        if (error) {
          throw error;
        }

        logger.info('Successfully synced conversation from queue', { id: item.id });
      } catch (error) {
        logger.error('Failed to sync conversation from queue', { 
          id: item.id, 
          retryCount: item.retryCount,
          error 
        });

        if (item.retryCount < this.maxRetries) {
          failedItems.push({
            ...item,
            retryCount: item.retryCount + 1
          });
        } else {
          logger.error('Conversation exceeded max retries, dropping from queue', { id: item.id });
        }
      }
    }

    this.queue = failedItems;
    this.saveToStorage();
    this.isProcessing = false;

    logger.info(`Chat queue processing complete. ${failedItems.length} items remain`);
  }

  // Get queue status for debugging
  getStatus() {
    return {
      queueLength: this.queue.length,
      isProcessing: this.isProcessing,
      items: this.queue.map(item => ({
        id: item.id,
        title: item.title,
        retryCount: item.retryCount,
        created_at: item.created_at
      }))
    };
  }
}

export const chatReliabilityQueue = new ChatReliabilityQueue();