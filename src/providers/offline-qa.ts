import type { LLMProvider } from './types';
import type { ProviderId, ProviderResponse } from '../shared/types';

/**
 * Explicitly opt-in QA provider. It exists only to test extraction, messaging,
 * cache, analytics, and intervention UI without an API key. It never fetches.
 */
export function createOfflineQaProvider(id: ProviderId, classification: ProviderResponse['classification']): LLMProvider {
  return {
    id,
    async classify(): Promise<ProviderResponse> {
      return {
        classification,
        confidence: classification === 'uncertain' ? 0.5 : 0.99,
        category: classification === 'productive' ? 'education' : classification === 'distracting' ? 'short-form entertainment' : 'uncertain',
        reason: `Offline QA scenario: ${classification}. No provider request was made.`,
      };
    },
  };
}
