import type { ProviderId, ProviderRequest, ProviderResponse } from '../shared/types';
export interface LLMProvider { id: ProviderId; classify(request: ProviderRequest): Promise<ProviderResponse>; }
export function providerUrl(provider: ProviderId): string { return provider === 'openai' ? 'https://api.openai.com/v1/chat/completions' : 'https://api.anthropic.com/v1/messages'; }
