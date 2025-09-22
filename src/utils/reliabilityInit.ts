// Initialize reliability systems for chat and profile sync
import { chatReliabilityQueue } from "./chatQueue";
import { profileSyncDiagnostics } from "./profileSyncDiagnostics";
import { logger } from "./logger";

export const initReliabilitySystems = () => {
  // Start the systems
  logger.info("Initializing reliability systems for data sync");
  
  // Process any queued chat conversations from previous session
  chatReliabilityQueue.processQueue();
  
  // Run a health check for profile sync
  profileSyncDiagnostics.performHealthCheck();
  
  // Log initial system status
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