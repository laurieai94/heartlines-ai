// Profile sync diagnostics and logging
// Profile sync diagnostics - logger removed for performance optimization
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
      // Failed to load sync metrics (logging removed for performance)
    }
  }

  private saveMetrics() {
    try {
      localStorage.setItem('profile_sync_metrics', JSON.stringify(this.metrics));
    } catch (error) {
      // Failed to save sync metrics (logging removed for performance)
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
    
    // Profile sync attempt [${profileType}] (logging removed for performance)
  }

  logSyncSuccess(profileType: string) {
    const metrics = this.getMetrics(profileType);
    metrics.lastSyncSuccess = Date.now();
    metrics.failureCount = 0; // Reset on success
    
    this.saveMetrics();
    
    // Profile sync SUCCESS [${profileType}] (logging removed for performance)
  }

  logSyncFailure(profileType: string, error: any) {
    const metrics = this.getMetrics(profileType);
    metrics.failureCount++;
    
    this.saveMetrics();
    
    // Profile sync FAILED [${profileType}] (logging removed for performance)
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
        // Health check: No authenticated user (logging removed for performance)
        return false;
      }

      // Test database connectivity
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (error) {
        // Health check: Database connectivity failed (logging removed for performance)
        return false;
      }

      // Health check: All systems operational (logging removed for performance)
      return true;
    } catch (error) {
      // Health check: System error (logging removed for performance)
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

    // Profile sync system status (logging removed for performance)
    return status;
  }
}

export const profileSyncDiagnostics = new ProfileSyncDiagnostics();