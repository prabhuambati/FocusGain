export type Classification = 'productive' | 'distracting' | 'uncertain';
export type ProviderId = 'openai' | 'anthropic';
export type InterventionMode = 'block' | 'warn' | 'allow';
export type FallbackBehavior = 'allow' | 'warn' | 'block';
export type Sensitivity = 'low' | 'balanced' | 'high';
export type Platform = 'youtube' | 'reddit';

export interface Settings {
  productivityGoal: string;
  sensitivity: Sensitivity;
  blockedCategories: string[];
  allowedCategories: string[];
  interventionMode: InterventionMode;
  uncertainBehavior: InterventionMode;
  fallbackBehavior: FallbackBehavior;
  enabledPlatforms: Platform[];
  cacheDurationMinutes: number;
  provider: ProviderId;
  model: string;
  cheapModel: string;
  apiKey?: string;
  allowContinueAnyway: boolean;
  sendDescription: boolean;
}

export interface ExtractedContent {
  platform: Platform;
  url: string;
  canonicalId: string;
  title: string;
  description: string;
  author?: string;
  community?: string;
  text: string;
  extractedAt: number;
}

export interface ClassificationResult {
  classification: Classification;
  confidence: number;
  category: string;
  reason: string;
  provider: ProviderId;
  model: string;
  latencyMs: number;
  usage?: { inputTokens?: number; outputTokens?: number; totalTokens?: number };
  fromCache?: boolean;
}

export interface CacheEntry {
  key: string;
  fingerprint: string;
  normalizedText: string;
  settingsHash: string;
  provider: ProviderId;
  model: string;
  result: ClassificationResult;
  createdAt: number;
  expiresAt: number;
}

export interface AnalyticsEvent {
  id: string;
  timestamp: number;
  type: 'classification' | 'intervention' | 'override' | 'error';
  platform?: Platform;
  classification?: Classification;
  blocked?: boolean;
  overridden?: boolean;
  cacheHit?: boolean;
  provider?: ProviderId;
  model?: string;
  latencyMs?: number;
  inputTokens?: number;
  outputTokens?: number;
  estimatedCostUsd?: number;
  errorCode?: string;
}

export interface ProviderRequest {
  content: ExtractedContent;
  settings: Settings;
  model: string;
}

export interface ProviderResponse {
  classification: Classification;
  confidence: number;
  category: string;
  reason: string;
  usage?: { inputTokens?: number; outputTokens?: number; totalTokens?: number };
}

export interface ClassifierDependencies {
  now?: () => number;
  fetcher?: typeof fetch;
}
