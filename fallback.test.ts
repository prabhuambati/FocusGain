import { describe, expect, it } from 'vitest';
import { fallbackAction } from '../src/classifier/fallback';
import { DEFAULT_SETTINGS } from '../src/shared/settings';

describe('provider failure fallback', () => {
  it('uses the configured fallback without inventing a classification', () => {
    expect(fallbackAction({ ...DEFAULT_SETTINGS, fallbackBehavior: 'allow' }, 'provider_http_429')).toBe('allow');
    expect(fallbackAction({ ...DEFAULT_SETTINGS, fallbackBehavior: 'block' }, 'missing_api_key')).toBe('block');
  });
});
