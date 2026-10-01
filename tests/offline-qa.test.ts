import { describe, expect, it } from 'vitest';
import { createOfflineQaProvider } from '../src/providers/offline-qa';
import { DEFAULT_SETTINGS, validateSettings } from '../src/shared/settings';

describe('offline QA mode', () => {
  it('is disabled by default', () => {
    expect(DEFAULT_SETTINGS.offlineQaMode).toBe(false);
    expect(DEFAULT_SETTINGS.diagnosticsEnabled).toBe(false);
  });

  it('normalizes invalid QA scenarios safely', () => {
    expect(validateSettings({ offlineQaMode: true, offlineQaClassification: 'invalid' as any }).offlineQaClassification).toBe('distracting');
  });

  it('returns an explicit local scenario without provider usage', async () => {
    const provider = createOfflineQaProvider('openai', 'uncertain');
    const result = await provider.classify({} as any);
    expect(result.classification).toBe('uncertain');
    expect(result.reason).toContain('No provider request was made');
    expect(result.usage).toBeUndefined();
  });
});
