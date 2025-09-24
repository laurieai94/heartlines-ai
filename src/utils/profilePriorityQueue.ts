// Priority queue system for profile operations
import { logger } from './logger';

export interface QueuedOperation {
  id: string;
  priority: 'critical' | 'high' | 'normal' | 'low';
  operation: () => Promise<void>;
  profileType: 'personal' | 'partner';
  timestamp: number;
  retries: number;
}

// Critical fields that need immediate sync for UI feedback
const CRITICAL_FIELDS = new Set([
  'name', 'partnerName', 'relationshipStatus', 'age', 'partnerAge'
]);

const HIGH_PRIORITY_FIELDS = new Set([
  'gender', 'partnerGender', 'orientation', 'partnerOrientation', 
  'pronouns', 'partnerPronouns'
]);

class ProfilePriorityQueue {
  private queues = {
    critical: [] as QueuedOperation[],
    high: [] as QueuedOperation[],
    normal: [] as QueuedOperation[],
    low: [] as QueuedOperation[]
  };

  private processing = false;
  private processTimer: NodeJS.Timeout | null = null;

  // Determine priority based on field importance
  getFieldPriority(field: string): 'critical' | 'high' | 'normal' | 'low' {
    if (CRITICAL_FIELDS.has(field)) return 'critical';
    if (HIGH_PRIORITY_FIELDS.has(field)) return 'high';
    
    // Profile completion actions are high priority
    if (field.includes('completion') || field.includes('progress')) return 'high';
    
    return 'normal';
  }

  // Add operation to appropriate priority queue
  enqueue(operation: Omit<QueuedOperation, 'id' | 'timestamp' | 'retries'>) {
    const queuedOp: QueuedOperation = {
      ...operation,
      id: `${operation.profileType}-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      retries: 0
    };

    this.queues[operation.priority].push(queuedOp);
    logger.info(`[Queue] Added ${operation.priority} priority operation for ${operation.profileType}`);
    
    // Start processing immediately for critical operations
    if (operation.priority === 'critical') {
      this.processQueue();
    } else if (!this.processing) {
      // Batch process other priorities
      this.scheduleProcessing();
    }
  }

  // Process queue with priority ordering
  private async processQueue() {
    if (this.processing) return;
    
    this.processing = true;
    const startTime = performance.now();

    try {
      // Process in priority order
      for (const priority of ['critical', 'high', 'normal', 'low'] as const) {
        while (this.queues[priority].length > 0) {
          const operation = this.queues[priority].shift()!;
          
          try {
            await this.executeWithTimeout(operation);
            logger.info(`[Queue] Completed ${priority} operation: ${operation.id}`);
          } catch (error) {
            await this.handleFailedOperation(operation, error);
          }

          // Yield control every few operations to prevent blocking
          if (performance.now() - startTime > 50) {
            await new Promise(resolve => setTimeout(resolve, 0));
          }
        }
      }
    } finally {
      this.processing = false;
      logger.info(`[Queue] Processing completed in ${(performance.now() - startTime).toFixed(2)}ms`);
    }
  }

  // Execute operation with timeout
  private async executeWithTimeout(operation: QueuedOperation): Promise<void> {
    const timeout = operation.priority === 'critical' ? 1000 : 2000;
    
    return Promise.race([
      operation.operation(),
      new Promise<void>((_, reject) => 
        setTimeout(() => reject(new Error('Operation timeout')), timeout)
      )
    ]);
  }

  // Handle failed operations with retry logic
  private async handleFailedOperation(operation: QueuedOperation, error: any) {
    operation.retries++;
    const maxRetries = operation.priority === 'critical' ? 3 : 2;

    if (operation.retries < maxRetries) {
      // Exponential backoff for retries
      const delay = Math.min(1000 * Math.pow(2, operation.retries - 1), 5000);
      
      setTimeout(() => {
        // Re-queue with lower priority to prevent infinite critical loops
        const newPriority = operation.priority === 'critical' ? 'high' : operation.priority;
        this.queues[newPriority].push({ ...operation, priority: newPriority });
        
        if (!this.processing) {
          this.scheduleProcessing();
        }
      }, delay);
      
      logger.warn(`[Queue] Retrying operation ${operation.id} (attempt ${operation.retries + 1})`);
    } else {
      logger.error(`[Queue] Operation failed after ${maxRetries} attempts:`, operation.id, error);
    }
  }

  // Schedule batch processing for non-critical operations
  private scheduleProcessing() {
    if (this.processTimer) return;
    
    this.processTimer = setTimeout(() => {
      this.processTimer = null;
      this.processQueue();
    }, 100); // Small delay to batch operations
  }

  // Get queue status for monitoring
  getQueueStatus() {
    return {
      critical: this.queues.critical.length,
      high: this.queues.high.length,
      normal: this.queues.normal.length,
      low: this.queues.low.length,
      processing: this.processing
    };
  }

  // Clear all queues (for cleanup)
  clear() {
    Object.values(this.queues).forEach(queue => queue.length = 0);
    if (this.processTimer) {
      clearTimeout(this.processTimer);
      this.processTimer = null;
    }
    this.processing = false;
  }
}

export const profilePriorityQueue = new ProfilePriorityQueue();