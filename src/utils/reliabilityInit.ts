// Initialize reliability systems for chat and profile sync
import { chatReliabilityQueue } from "./chatQueue";
import { profileSyncDiagnostics } from "./profileSyncDiagnostics";
import { logger } from "./logger";

export const initReliabilitySystems = async () => {
  // Yield control to prevent blocking main thread
  const yieldControl = () => new Promise(resolve => setTimeout(resolve, 0));
  
  try {
    logger.info("Initializing reliability systems for data sync");
    
    // Yield before heavy operations
    await yieldControl();
    
    // Process any queued chat conversations (non-blocking)
    setTimeout(() => {
      try {
        chatReliabilityQueue.processQueue();
      } catch (error) {
        logger.error("Error processing chat queue:", error);
      }
    }, 100);
    
    // Yield again
    await yieldControl();
    
    // Run health check (deferred)
    setTimeout(() => {
      try {
        profileSyncDiagnostics.performHealthCheck();
      } catch (error) {
        logger.error("Error in profile sync health check:", error);
      }
    }, 200);
    
    // Log status asynchronously
    setTimeout(() => {
      try {
        const chatStatus = chatReliabilityQueue.getStatus();
        const profileStatus = profileSyncDiagnostics.getSystemStatus();
        
        logger.info("Reliability systems initialized", {
          chatQueue: {
            pendingItems: chatStatus.queueLength,
            isProcessing: chatStatus.isProcessing
          },
          profileSync: {
            personalHealthy: profileStatus.personal.isHealthy,
            partnerHealthy: profileStatus.partner.isHealthy
          }
        });
      } catch (error) {
        logger.error("Error getting system status:", error);
      }
    }, 300);
  } catch (error) {
    logger.error("Error initializing reliability systems:", error);
  }

  // Setup window globals for debugging (dev only)
  if (import.meta.env.DEV) {
    (window as any).reliabilityDebug = {
      chatQueue: chatReliabilityQueue,
      profileDiagnostics: profileSyncDiagnostics,
      getChatQueueStatus: () => chatReliabilityQueue.getStatus(),
      getProfileStatus: () => profileSyncDiagnostics.getSystemStatus(),
      runHealthCheck: () => profileSyncDiagnostics.performHealthCheck()
    };
  }
};