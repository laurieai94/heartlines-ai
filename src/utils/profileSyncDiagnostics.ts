// Profile sync diagnostics and logging
import { logger } from "./logger";
import { supabase } from "@/integrations/supabase/client";

interface SyncMetrics {
  lastSyncAttempt: number;
  lastSyncSuccess: number;
  failureCount: number;
  totalSyncs: number;
}

class ProfileSyncDiagnostics {
  private metrics: Record<string, SyncMetrics> = {};
  
  constructor() {
    this.loadMetrics();
  }

  private loadMetrics() {
    try {
      const stored = localStorage.getItem('profile_sync_metrics');
      if (stored) {
        this.metrics = JSON.parse(stored);
      }
    } catch (error) {
      logger.error('Failed to load sync metrics', error);
    }
  }

  private saveMetrics() {
    try {
      localStorage.setItem('profile_sync_metrics', JSON.stringify(this.metrics));
    } catch (error) {
      logger.error('Failed to save sync metrics', error);
    }
  }

  private getMetrics(profileType: string): SyncMetrics {
    if (!this.metrics[profileType]) {
      this.metrics[profileType] = {
        lastSyncAttempt: 0,
        lastSyncSuccess: 0,
        failureCount: 0,
        totalSyncs: 0
      };
    }
    return this.metrics[profileType];
  }

  logSyncAttempt(profileType: string, data: any) {
    const metrics = this.getMetrics(profileType);
    metrics.lastSyncAttempt = Date.now();
    metrics.totalSyncs++;
    
    logger.info(`Profile sync attempt [${profileType}]`, {
      totalSyncs: metrics.totalSyncs,
      dataSize: JSON.stringify(data).length,
      fieldCount: Object.keys(data).length,
      hasRequiredFields: this.hasRequiredFields(profileType, data)
    });
  }

  logSyncSuccess(profileType: string) {
    const metrics = this.getMetrics(profileType);
    metrics.lastSyncSuccess = Date.now();
    metrics.failureCount = 0; // Reset on success
    
    this.saveMetrics();
    
    logger.info(`Profile sync SUCCESS [${profileType}]`, {
      timeSinceLastAttempt: Date.now() - metrics.lastSyncAttempt,
      totalSyncs: metrics.totalSyncs
    });
  }

  logSyncFailure(profileType: string, error: any) {
    const metrics = this.getMetrics(profileType);
    metrics.failureCount++;
    
    this.saveMetrics();
    
    logger.error(`Profile sync FAILED [${profileType}]`, {
      failureCount: metrics.failureCount,
      timeSinceLastSuccess: metrics.lastSyncSuccess ? Date.now() - metrics.lastSyncSuccess : 'never',
      error: error?.message || error
    });
  }

  private hasRequiredFields(profileType: string, data: any): boolean {
    if (profileType === 'personal') {
      return !!(data.name || data.age);
    } else if (profileType === 'partner') {
      return !!(data.partnerName || data.partnerAge);
    }
    return true;
  }

  async performHealthCheck() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        logger.warn('Health check: No authenticated user');
        return false;
      }

      // Test database connectivity
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (error) {
        logger.error('Health check: Database connectivity failed', error);
        return false;
      }

      logger.info('Health check: All systems operational', {
        userId: user.id,
        profileCount: data?.length || 0
      });
      return true;
    } catch (error) {
      logger.error('Health check: System error', error);
      return false;
    }
  }

  getSystemStatus() {
    const personal = this.getMetrics('personal');
    const partner = this.getMetrics('partner');
    
    const status = {
      personal: {
        lastSyncSuccess: personal.lastSyncSuccess ? new Date(personal.lastSyncSuccess).toLocaleString() : 'never',
        failureCount: personal.failureCount,
        totalSyncs: personal.totalSyncs,
        isHealthy: personal.failureCount === 0 && personal.lastSyncSuccess > 0
      },
      partner: {
        lastSyncSuccess: partner.lastSyncSuccess ? new Date(partner.lastSyncSuccess).toLocaleString() : 'never',
        failureCount: partner.failureCount,
        totalSyncs: partner.totalSyncs,
        isHealthy: partner.failureCount === 0 && partner.lastSyncSuccess > 0
      }
    };

    logger.info('Profile sync system status', status);
    return status;
  }
}

export const profileSyncDiagnostics = new ProfileSyncDiagnostics();