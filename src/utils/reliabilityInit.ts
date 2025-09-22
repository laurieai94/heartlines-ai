// Initialize reliability systems for chat and profile sync
import { chatReliabilityQueue } from "./chatQueue";
import { profileSyncDiagnostics } from "./profileSyncDiagnostics";
import { logger } from "./logger";

export const initReliabilitySystems = () => {
  try {
    // Start the systems with error handling
    logger.info("Initializing reliability systems for data sync");
    
    // Process any queued chat conversations from previous session
    try {
      chatReliabilityQueue.processQueue();
    } catch (error) {
      console.log("Chat queue initialization failed:", error);
    }
    
    // Run a health check for profile sync
    try {
      profileSyncDiagnostics.performHealthCheck();
    } catch (error) {
      console.log("Profile sync diagnostics failed:", error);
    }
  
    // Log initial system status
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
      console.log("System status logging failed:", error);
    }

    // Setup window globals for debugging (dev only)
    if (import.meta.env.DEV) {
      try {
        (window as any).reliabilityDebug = {
          chatQueue: chatReliabilityQueue,
          profileDiagnostics: profileSyncDiagnostics,
          getChatQueueStatus: () => chatReliabilityQueue.getStatus(),
          getProfileStatus: () => profileSyncDiagnostics.getSystemStatus(),
          runHealthCheck: () => profileSyncDiagnostics.performHealthCheck()
        };
      } catch (error) {
        console.log("Debug setup failed:", error);
      }
    }
  } catch (error) {
    console.error("Reliability systems initialization failed:", error);
  }
};