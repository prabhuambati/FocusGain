import type { CacheEntry, ClassificationResult, ExtractedContent, ProviderId, Settings } from '../shared/types';
import { readCache, writeCache } from '../shared/storage';

export function normalizeContent(content: ExtractedContent): string {
  return [content.platform, content.canonicalId, content.title, content.description, content.author || '', content.community || '', content.text]
    .join(' ').toLowerCase().replace(/https?:\/\/\S+/g, ' ').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
}

function tokenSet(text: string): Set<string> { return new Set(text.split(' ').filter(t => t.length > 2)); }
export function similarity(a: string, b: string): number {
  const aa = tokenSet(a), bb = tokenSet(b); if (!aa.size || !bb.size) return 0;
  let intersection = 0; for (const token of aa) if (bb.has(token)) intersection++;
  return intersection / (aa.size + bb.size - intersection);
}

async function digest(text: string): Promise<string> {
  if (globalThis.crypto?.subtle) {
    const bytes = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 2166136261; for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return `fnv-${(h >>> 0).toString(16)}`;
}

export async function makeCacheKey(content: ExtractedContent, settings: Settings, model: string): Promise<{ key: string; fingerprint: string; normalizedText: string; settingsHash: string }> {
  const normalizedText = normalizeContent(content);
  const settingsHash = await digest(JSON.stringify({ goal: settings.productivityGoal, sensitivity: settings.sensitivity, blocked: [...settings.blockedCategories].sort(), allowed: [...settings.allowedCategories].sort(), offlineQaMode: settings.offlineQaMode, offlineQaClassification: settings.offlineQaClassification }));
  const fingerprint = await digest(normalizedText);
  return { key: await digest(`${fingerprint}:${settings.provider}:${model}:${settingsHash}`), fingerprint, normalizedText, settingsHash };
}

export async function getCachedClassification(content: ExtractedContent, settings: Settings, provider: ProviderId, model: string, now = Date.now()): Promise<ClassificationResult | null> {
  const keyData = await makeCacheKey(content, settings, model);
  const entries = (await readCache()).filter(e => e.expiresAt > now);
  if (entries.length !== (await readCache()).length) await writeCache(entries);
  const exact = entries.find(e => e.key === keyData.key);
  if (exact) return { ...exact.result, fromCache: true };
  const near = entries.find(e => e.provider === provider && e.model === model && e.settingsHash === keyData.settingsHash && similarity(e.normalizedText, keyData.normalizedText) >= 0.96);
  return near ? { ...near.result, fromCache: true } : null;
}

export async function putCachedClassification(content: ExtractedContent, settings: Settings, provider: ProviderId, model: string, result: ClassificationResult, now = Date.now()): Promise<void> {
  const keyData = await makeCacheKey(content, settings, model);
  const entries = (await readCache()).filter(e => e.key !== keyData.key && e.expiresAt > now);
  const entry: CacheEntry = { ...keyData, provider, model, result: { ...result, fromCache: false }, createdAt: now, expiresAt: now + settings.cacheDurationMinutes * 60_000 };
  await writeCache([...entries, entry]);
}
