// Chat message reliability queue for offline/failed saves  
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/AIInsights";
import { batchedStorage } from './batchedStorage';
// Logger removed for performance optimization

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
      const stored = batchedStorage.getItem('chat_queue');
      if (stored) {
        this.queue = JSON.parse(stored);
        // Loaded ${this.queue.length} items from chat queue (logging removed for performance)
      }
    } catch (error) {
      // Failed to load chat queue from storage (logging removed for performance)
      this.queue = [];
    }
  }

  private saveToStorage() {
    try {
      batchedStorage.setItem('chat_queue', JSON.stringify(this.queue));
    } catch (error) {
      // Failed to save chat queue to storage (logging removed for performance)
    }
  }

  enqueue(conversationData: Omit<QueuedChat, 'retryCount'>) {
    // Cap queue size to prevent memory issues
    if (this.queue.length >= this.maxQueueSize) {
      this.queue.shift(); // Remove oldest item
      // Chat queue at max size, removed oldest item (logging removed for performance)
    }

    const queueItem: QueuedChat = {
      ...conversationData,
      retryCount: 0
    };

    // Remove existing item with same ID if any
    this.queue = this.queue.filter(item => item.id !== queueItem.id);
    this.queue.push(queueItem);
    
    this.saveToStorage();
    // Added conversation to reliability queue (logging removed for performance)

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
    // Processing chat queue with ${this.queue.length} items (logging removed for performance)

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

        // Successfully synced conversation from queue (logging removed for performance)
      } catch (error) {
        // Failed to sync conversation from queue (logging removed for performance)

        if (item.retryCount < this.maxRetries) {
          failedItems.push({
            ...item,
            retryCount: item.retryCount + 1
          });
        } else {
          // Conversation exceeded max retries, dropping from queue (logging removed for performance)
        }
      }
    }

    this.queue = failedItems;
    this.saveToStorage();
    this.isProcessing = false;

    // Chat queue processing complete. ${failedItems.length} items remain (logging removed for performance)
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