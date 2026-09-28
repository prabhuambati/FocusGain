import type { Classification, ProviderResponse } from '../shared/types';
const classifications: Classification[] = ['productive', 'distracting', 'uncertain'];
export function parseProviderJson(raw: unknown): ProviderResponse {
  if (typeof raw !== 'string') throw new Error('invalid_provider_payload');
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  let value: any; try { value = JSON.parse(cleaned); } catch { throw new Error('invalid_provider_json'); }
  if (!classifications.includes(value.classification)) throw new Error('invalid_classification');
  const confidence = Number(value.confidence); if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) throw new Error('invalid_confidence');
  const category = typeof value.category === 'string' && value.category.trim() ? value.category.trim().slice(0, 80) : 'uncategorized';
  const reason = typeof value.reason === 'string' && value.reason.trim() ? value.reason.trim().slice(0, 240) : 'No reason provided.';
  return { classification: value.classification, confidence, category, reason };
}
