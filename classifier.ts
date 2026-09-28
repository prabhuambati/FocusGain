import type { ClassifierDependencies, ClassificationResult, ExtractedContent, ProviderId, Settings } from '../shared/types';
import { getCachedClassification, putCachedClassification } from '../cache/cache';
import { routeContent, modelForProvider } from './router';
import type { LLMProvider } from '../providers/types';

export async function classifyContent(content: ExtractedContent, settings: Settings, providers: Record<ProviderId, LLMProvider>, deps: ClassifierDependencies = {}): Promise<ClassificationResult> {
  const now = deps.now || Date.now;
  const route = routeContent(content, settings);
  const model = modelForProvider(settings.provider, route.tier, settings);
  const cached = await getCachedClassification(content, settings, settings.provider, model, now());
  if (cached) return cached;
  const provider = providers[settings.provider];
  if (!provider) throw new Error('provider_unavailable');
  const started = now();
  try {
    const response = await provider.classify({ content, settings, model });
    const result: ClassificationResult = { ...response, provider: settings.provider, model, latencyMs: Math.max(0, now() - started), fromCache: false };
    await putCachedClassification(content, settings, settings.provider, model, result, now());
    return result;
  } catch (error) { throw error instanceof Error ? error : new Error('classification_failed'); }
}
