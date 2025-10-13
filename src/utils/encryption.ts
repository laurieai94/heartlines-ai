// Privacy settings utilities
import { batchedStorage } from './batchedStorage';

export class PrivacyManager {
  // Get privacy settings
  static getPrivacySettings() {
    return {
      marketingEmails: batchedStorage.getItem('privacy_marketing_emails') !== 'false',
      dataRetention: batchedStorage.getItem('privacy_data_retention') || '90',
      anonymousUsage: batchedStorage.getItem('privacy_anonymous_usage') !== 'false'
    };
  }

  // Update privacy settings
  static updatePrivacySettings(settings: Partial<{
    marketingEmails: boolean;
    dataRetention: string;
    anonymousUsage: boolean;
  }>) {
    if (settings.marketingEmails !== undefined) {
      batchedStorage.setItem('privacy_marketing_emails', settings.marketingEmails.toString());
    }
    if (settings.dataRetention !== undefined) {
      batchedStorage.setItem('privacy_data_retention', settings.dataRetention);
    }
    if (settings.anonymousUsage !== undefined) {
      batchedStorage.setItem('privacy_anonymous_usage', settings.anonymousUsage.toString());
    }
  }
}