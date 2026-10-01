import type { Settings } from './types';

export const DEFAULT_SETTINGS: Settings = {
  productivityGoal: 'Learn, build software, and complete focused academic work.',
  sensitivity: 'balanced',
  blockedCategories: ['gaming', 'music', 'memes', 'celebrity', 'short-form entertainment'],
  allowedCategories: ['education', 'programming', 'research', 'news', 'career', 'university'],
  interventionMode: 'block',
  uncertainBehavior: 'warn',
  fallbackBehavior: 'warn',
  enabledPlatforms: ['youtube', 'reddit'],
  cacheDurationMinutes: 120,
  provider: 'openai',
  model: 'gpt-4o',
  cheapModel: 'gpt-4o-mini',
  allowContinueAnyway: true,
  sendDescription: true,
  diagnosticsEnabled: false,
  offlineQaMode: false,
  offlineQaClassification: 'distracting',
};

export function validateSettings(input: Partial<Settings>): Settings {
  const merged: Settings = { ...DEFAULT_SETTINGS, ...input };
  if (!merged.productivityGoal.trim()) merged.productivityGoal = DEFAULT_SETTINGS.productivityGoal;
  merged.cacheDurationMinutes = Math.min(7 * 24 * 60, Math.max(5, Number(merged.cacheDurationMinutes) || DEFAULT_SETTINGS.cacheDurationMinutes));
  merged.blockedCategories = [...new Set((merged.blockedCategories || []).map(String).map(s => s.trim()).filter(Boolean))];
  merged.allowedCategories = [...new Set((merged.allowedCategories || []).map(String).map(s => s.trim()).filter(Boolean))];
  merged.enabledPlatforms = merged.enabledPlatforms.filter(p => p === 'youtube' || p === 'reddit');
  if (!['low', 'balanced', 'high'].includes(merged.sensitivity)) merged.sensitivity = DEFAULT_SETTINGS.sensitivity;
  if (!['block', 'warn', 'allow'].includes(merged.interventionMode)) merged.interventionMode = DEFAULT_SETTINGS.interventionMode;
  if (!['block', 'warn', 'allow'].includes(merged.uncertainBehavior)) merged.uncertainBehavior = DEFAULT_SETTINGS.uncertainBehavior;
  if (!['allow', 'warn', 'block'].includes(merged.fallbackBehavior)) merged.fallbackBehavior = DEFAULT_SETTINGS.fallbackBehavior;
  if (!['openai', 'anthropic'].includes(merged.provider)) merged.provider = DEFAULT_SETTINGS.provider;
  if (!['productive', 'distracting', 'uncertain'].includes(merged.offlineQaClassification)) merged.offlineQaClassification = DEFAULT_SETTINGS.offlineQaClassification;
  merged.diagnosticsEnabled = Boolean(merged.diagnosticsEnabled);
  merged.offlineQaMode = Boolean(merged.offlineQaMode);
  return merged;
}

export async function getSettings(): Promise<Settings> {
  const stored = await chrome.storage.local.get('settings');
  return validateSettings(stored.settings || {});
}

export async function saveSettings(settings: Partial<Settings>): Promise<Settings> {
  const next = validateSettings(settings);
  await chrome.storage.local.set({ settings: next });
  return next;
}
