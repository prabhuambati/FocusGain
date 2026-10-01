import type { AnalyticsEvent, DiagnosticEntry, Platform } from '../shared/types';
import { appendAnalytics, appendDiagnostic, readAnalytics } from '../shared/storage';

export async function recordEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<void> { await appendAnalytics({ ...event, id: crypto.randomUUID(), timestamp: Date.now() }); }
export async function recordDiagnostic(event: Omit<DiagnosticEntry, 'id' | 'timestamp'>, enabled: boolean): Promise<void> {
  if (!enabled) return;
  await appendDiagnostic({ ...event, id: crypto.randomUUID(), timestamp: Date.now() });
}
export interface AnalyticsSummary { totalAnalyzed: number; productive: number; distracting: number; uncertain: number; blocked: number; overrides: number; cacheHits: number; cacheMisses: number; averageLatencyMs: number; estimatedApiCallsAvoided: number; estimatedCostUsd: number; }
export function summarizeAnalytics(events: AnalyticsEvent[]): AnalyticsSummary {
  const classifications = events.filter(e => e.type === 'classification');
  const latencies = classifications.map(e => e.latencyMs || 0).filter(n => n > 0);
  return {
    totalAnalyzed: classifications.length,
    productive: classifications.filter(e => e.classification === 'productive').length,
    distracting: classifications.filter(e => e.classification === 'distracting').length,
    uncertain: classifications.filter(e => e.classification === 'uncertain').length,
    blocked: events.filter(e => e.type === 'intervention' && e.blocked).length,
    overrides: events.filter(e => e.type === 'override' && e.overridden).length,
    cacheHits: classifications.filter(e => e.cacheHit).length,
    cacheMisses: classifications.filter(e => e.cacheHit === false).length,
    averageLatencyMs: latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0,
    estimatedApiCallsAvoided: classifications.filter(e => e.cacheHit).length,
    estimatedCostUsd: events.reduce((sum, e) => sum + (e.estimatedCostUsd || 0), 0),
  };
}
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> { return summarizeAnalytics(await readAnalytics()); }
export function platformLabel(platform?: Platform): string { return platform ? platform[0].toUpperCase() + platform.slice(1) : 'Unknown'; }
