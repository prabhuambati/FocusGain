import type { ExtractedContent, ProviderId, Settings } from '../shared/types';
export interface RouteDecision { model: string; tier: 'cheap' | 'strong'; reason: string; }
export function routeContent(content: ExtractedContent, settings: Settings): RouteDecision {
  const signal = `${content.title} ${content.description} ${content.text}`.trim();
  const short = signal.length < 180;
  const mixed = /\b(vs|but|however|review|reaction|commentary|opinion)\b/i.test(signal);
  const lowContext = !content.title || signal.length < 70;
  if (short || lowContext || mixed) return { model: settings.model, tier: 'strong', reason: 'short, mixed, or low-context content needs stronger reasoning' };
  return { model: settings.cheapModel, tier: 'cheap', reason: 'sufficient metadata for a lower-cost first pass' };
}
export function modelForProvider(provider: ProviderId, tier: 'cheap' | 'strong', settings: Settings): string {
  if (provider === 'openai') return tier === 'cheap' ? (settings.cheapModel || 'gpt-4o-mini') : (settings.model || 'gpt-4o');
  return tier === 'cheap' ? (settings.cheapModel || 'claude-3-5-haiku-latest') : (settings.model || 'claude-sonnet-4-20250514');
}
