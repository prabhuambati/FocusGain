import type { ClassificationResult, ExtractedContent } from '../shared/types';
export type ExtensionMessage =
  | { type: 'CLASSIFY_CONTENT'; content: ExtractedContent }
  | { type: 'OVERRIDE_CONTENT'; contentId: string }
  | { type: 'OPEN_OPTIONS' }
  | { type: 'CLEAR_DATA' };
export type ExtensionResponse = { ok: true; result?: ClassificationResult; action?: 'block' | 'warn' | 'allow' } | { ok: false; error: string; fallback: 'allow' | 'warn' | 'block' };
