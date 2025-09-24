// Ultra-fast profile data compression utilities
import { logger } from './logger';

// Lightweight compression using simple dictionary encoding
class ProfileCompression {
  private compressionMap = new Map<string, string>([
    // Common field names
    ['partnerName', 'pN'],
    ['partnerAge', 'pA'],
    ['partnerGender', 'pG'],
    ['partnerOrientation', 'pO'],
    ['partnerPronouns', 'pP'],
    ['partnerLoveLanguage', 'pLL'],
    ['partnerConflictStyle', 'pCS'],
    ['partnerCommunicationResponse', 'pCR'],
    ['partnerSelfAwareness', 'pSA'],
    ['partnerHeartbreakBetrayal', 'pHB'],
    ['partnerFamilyStructure', 'pFS'],
    ['partnerAttachmentStyle', 'pAS'],
    ['relationshipStatus', 'rS'],
    ['relationshipLength', 'rL'],
    ['relationshipChallenges', 'rC'],
    ['relationshipWorking', 'rW'],
    ['talkingDuration', 'tD'],
    ['talkingDescription', 'tDe'],
    ['talkingChallenges', 'tC'],
    ['datingChallenges', 'dC'],
    ['datingReadiness', 'dR'],
    ['separationSituation', 'sS'],
    ['heartbreakBetrayal', 'hB'],
    ['familyStructure', 'fS'],
    ['attachmentStyle', 'aS'],
    ['conflictStyle', 'cS'],
    ['stressResponse', 'sR'],
    ['loveLanguage', 'lL'],
    ['orientation', 'o'],
    ['gender', 'g'],
    ['pronouns', 'p'],
    ['grievingProcess', 'gP'],
    ['timeSinceLoss', 'tSL'],
    // Common values
    ['Physical Touch', 'PT'],
    ['Words of Affirmation', 'WA'],
    ['Quality Time', 'QT'],
    ['Acts of Service', 'AS'],
    ['Receiving Gifts', 'RG'],
    ['Secure', 'S'],
    ['Anxious', 'A'],
    ['Avoidant', 'Av'],
    ['Disorganized', 'D'],
    ['Heterosexual', 'H'],
    ['Homosexual', 'Ho'],
    ['Bisexual', 'B'],
    ['Pansexual', 'Pa'],
    ['Asexual', 'As'],
    ['In a relationship', 'IR'],
    ['Single', 'Si'],
    ['It\'s complicated', 'IC'],
    ['Married', 'M'],
    ['Divorced', 'Di'],
    ['Separated', 'Se'],
    ['Widowed', 'W']
  ]);

  private decompressionMap = new Map<string, string>();

  constructor() {
    // Create reverse mapping for decompression
    this.compressionMap.forEach((short, long) => {
      this.decompressionMap.set(short, long);
    });
  }

  // Compress profile data for storage
  compress(data: any): string {
    try {
      // First pass: replace field names and values
      let jsonString = JSON.stringify(data);
      
      this.compressionMap.forEach((short, long) => {
        const regex = new RegExp(`"${long}"`, 'g');
        jsonString = jsonString.replace(regex, `"${short}"`);
      });

      // Second pass: remove empty arrays and null values to save space
      const compressed = JSON.parse(jsonString);
      this.removeEmptyValues(compressed);

      return JSON.stringify(compressed);
    } catch (error) {
      logger.warn('Compression failed, using uncompressed data:', error);
      return JSON.stringify(data);
    }
  }

  // Decompress profile data from storage
  decompress(compressedString: string): any {
    try {
      let jsonString = compressedString;
      
      // Replace compressed keys/values back to original
      this.decompressionMap.forEach((long, short) => {
        const regex = new RegExp(`"${short}"`, 'g');
        jsonString = jsonString.replace(regex, `"${long}"`);
      });

      return JSON.parse(jsonString);
    } catch (error) {
      logger.warn('Decompression failed, using raw data:', error);
      try {
        return JSON.parse(compressedString);
      } catch {
        return {};
      }
    }
  }

  // Remove empty values to save space
  private removeEmptyValues(obj: any): void {
    if (Array.isArray(obj)) {
      return;
    }
    
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (value === null || value === undefined || value === '') {
          delete obj[key];
        } else if (Array.isArray(value) && value.length === 0) {
          delete obj[key];
        } else if (typeof value === 'object') {
          this.removeEmptyValues(value);
        }
      });
    }
  }

  // Get compression ratio for analytics
  getCompressionRatio(original: any, compressed: string): number {
    const originalSize = JSON.stringify(original).length;
    const compressedSize = compressed.length;
    return compressedSize / originalSize;
  }
}

export const profileCompression = new ProfileCompression();