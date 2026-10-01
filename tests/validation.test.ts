import { describe, expect, it } from 'vitest';
import { isValidExtensionMessage } from '../src/extension/validation';

describe('runtime message validation', () => {
  it('accepts bounded content messages', () => expect(isValidExtensionMessage({ type: 'CLASSIFY_CONTENT', content: { platform: 'youtube', url: 'https://youtube.com/watch?v=x', canonicalId: 'x', title: 'Lesson', description: '', text: 'Lesson' } })).toBe(true));
  it('rejects oversized or malformed messages', () => expect(isValidExtensionMessage({ type: 'CLASSIFY_CONTENT', content: { platform: 'youtube', url: 'x', canonicalId: 'x', title: 'x'.repeat(2000), description: '', text: '' } })).toBe(false));
});
