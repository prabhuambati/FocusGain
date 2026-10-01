import type { AnalyticsEvent, CacheEntry, DiagnosticEntry, Settings } from './types';
import { DEFAULT_SETTINGS, validateSettings } from './settings';

const KEYS = { settings: 'settings', cache: 'classificationCache', analytics: 'analyticsEvents', diagnostics: 'diagnosticEvents' } as const;

export async function loadSettings(): Promise<Settings> {
  const value = await chrome.storage.local.get(KEYS.settings);
  return validateSettings(value[KEYS.settings] || DEFAULT_SETTINGS);
}
export async function writeSettings(settings: Settings): Promise<void> { await chrome.storage.local.set({ [KEYS.settings]: settings }); }

export async function readCache(): Promise<CacheEntry[]> {
  const value = await chrome.storage.local.get(KEYS.cache);
  return Array.isArray(value[KEYS.cache]) ? value[KEYS.cache] : [];
}
export async function writeCache(entries: CacheEntry[]): Promise<void> { await chrome.storage.local.set({ [KEYS.cache]: entries.slice(-500) }); }

export async function readAnalytics(): Promise<AnalyticsEvent[]> {
  const value = await chrome.storage.local.get(KEYS.analytics);
  return Array.isArray(value[KEYS.analytics]) ? value[KEYS.analytics] : [];
}
export async function appendAnalytics(event: AnalyticsEvent): Promise<void> {
  const events = await readAnalytics();
  events.push(event);
  await chrome.storage.local.set({ [KEYS.analytics]: events.slice(-5000) });
}

export async function readDiagnostics(): Promise<DiagnosticEntry[]> {
  const value = await chrome.storage.local.get(KEYS.diagnostics);
  return Array.isArray(value[KEYS.diagnostics]) ? value[KEYS.diagnostics] : [];
}
export async function appendDiagnostic(entry: DiagnosticEntry): Promise<void> {
  const events = await readDiagnostics();
  events.push(entry);
  await chrome.storage.local.set({ [KEYS.diagnostics]: events.slice(-200) });
}

export async function clearIntelliBlockData(): Promise<void> { await chrome.storage.local.remove([KEYS.cache, KEYS.analytics, KEYS.diagnostics]); }
