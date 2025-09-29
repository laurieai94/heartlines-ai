// Privacy-first encryption utilities for sensitive data
import { batchedStorage } from './batchedStorage';

const ENCRYPTION_KEY_NAME = 'kai_privacy_key';
const SALT_LENGTH = 16;
const IV_LENGTH = 12;

export class PrivacyManager {
  private static encryptionKey: CryptoKey | null = null;

  // Generate or retrieve encryption key for local storage
  static async getOrCreateEncryptionKey(): Promise<CryptoKey> {
    if (this.encryptionKey) return this.encryptionKey;

    // Try to get existing key from localStorage
    const stored = batchedStorage.getItem(ENCRYPTION_KEY_NAME);
    if (stored) {
      try {
        const keyData = JSON.parse(stored);
        this.encryptionKey = await crypto.subtle.importKey(
          'raw',
          new Uint8Array(keyData),
          { name: 'AES-GCM' },
          false,
          ['encrypt', 'decrypt']
        );
        return this.encryptionKey;
      } catch (error) {
        // Silent fail, generate new key
      }
    }

    // Generate new key
    this.encryptionKey = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    // Store key for future use
    const exportedKey = await crypto.subtle.exportKey('raw', this.encryptionKey);
    batchedStorage.setItem(ENCRYPTION_KEY_NAME, JSON.stringify(Array.from(new Uint8Array(exportedKey))));

    return this.encryptionKey;
  }

  // Encrypt sensitive data
  static async encrypt(data: any): Promise<string> {
    try {
      const key = await this.getOrCreateEncryptionKey();
      const plaintext = JSON.stringify(data);
      const encodedText = new TextEncoder().encode(plaintext);
      
      const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encodedText
      );

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  // Decrypt sensitive data with backward compatibility
  static async decrypt(encryptedData: string): Promise<any> {
    try {
      // Check if data is already plaintext (backward compatibility)
      if (!encryptedData.startsWith('eyJ') && encryptedData.includes('{')) {
        try {
          return JSON.parse(encryptedData);
        } catch {
          // Not JSON, continue with decryption
        }
      }

      const key = await this.getOrCreateEncryptionKey();
      const combined = new Uint8Array(atob(encryptedData).split('').map(char => char.charCodeAt(0)));
      
      const iv = combined.slice(0, IV_LENGTH);
      const encrypted = combined.slice(IV_LENGTH);

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );

      const plaintext = new TextDecoder().decode(decrypted);
      return JSON.parse(plaintext);
    } catch (error) {
      console.warn('Decryption failed, attempting to parse as plaintext:', error);
      try {
        return JSON.parse(encryptedData);
      } catch {
        throw new Error('Failed to decrypt or parse data');
      }
    }
  }

  // Check if encryption is enabled
  static isEncryptionEnabled(): boolean {
    return batchedStorage.getItem('privacy_encryption_enabled') === 'true';
  }

  // Enable/disable encryption
  static setEncryptionEnabled(enabled: boolean): void {
    batchedStorage.setItem('privacy_encryption_enabled', enabled.toString());
  }

  // Get privacy settings
  static getPrivacySettings() {
    return {
      encryptionEnabled: this.isEncryptionEnabled(),
      marketingEmails: batchedStorage.getItem('privacy_marketing_emails') !== 'false',
      dataRetention: batchedStorage.getItem('privacy_data_retention') || '90',
      anonymousUsage: batchedStorage.getItem('privacy_anonymous_usage') !== 'false'
    };
  }

  // Update privacy settings
  static updatePrivacySettings(settings: Partial<{
    encryptionEnabled: boolean;
    marketingEmails: boolean;
    dataRetention: string;
    anonymousUsage: boolean;
  }>) {
    if (settings.encryptionEnabled !== undefined) {
      this.setEncryptionEnabled(settings.encryptionEnabled);
    }
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

  // Create local backup before enabling encryption
  static createLocalBackup(): string {
    const backup = {
      timestamp: new Date().toISOString(),
      conversations: batchedStorage.getItem('chat_conversations') || '[]',
      profiles: batchedStorage.getItem('personal_profile_data') || '{}',
      partnerProfiles: batchedStorage.getItem('partner_profile_data') || '{}'
    };
    
    const backupData = JSON.stringify(backup);
    const filename = `kai-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    // Create downloadable backup
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    return filename;
  }
}