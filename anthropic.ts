import type { LLMProvider } from './types';
import type { ProviderRequest, ProviderResponse } from '../shared/types';
import { parseProviderJson } from '../classifier/parser';

export function createAnthropicProvider(fetcher: typeof fetch = fetch): LLMProvider {
  return { id: 'anthropic', async classify(request: ProviderRequest): Promise<ProviderResponse> {
    if (!request.settings.apiKey) throw new Error('missing_api_key');
    const response = await fetcher('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': request.settings.apiKey, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: request.model, max_tokens: 300, temperature: 0, system: SYSTEM_PROMPT, messages: [{ role: 'user', content: buildPrompt(request) }] }) });
    if (!response.ok) throw new Error(`provider_http_${response.status}`);
    const data = await response.json() as any;
    const parsed = parseProviderJson(data.content?.[0]?.text);
    return { ...parsed, usage: data.usage ? { inputTokens: data.usage.input_tokens, outputTokens: data.usage.output_tokens, totalTokens: (data.usage.input_tokens || 0) + (data.usage.output_tokens || 0) } : undefined };
  }};
}
const SYSTEM_PROMPT = 'Classify online content for a productivity goal. Return only JSON with classification (productive, distracting, or uncertain), confidence (0 to 1), category, and a short reason. Use context, not isolated keywords.';
function buildPrompt(r: ProviderRequest): string { return JSON.stringify({ goal: r.settings.productivityGoal, sensitivity: r.settings.sensitivity, blockedCategories: r.settings.blockedCategories, allowedCategories: r.settings.allowedCategories, content: { platform: r.content.platform, title: r.content.title, description: r.settings.sendDescription ? r.content.description : '', author: r.content.author, community: r.content.community, text: r.content.text.slice(0, 5000) } }); }
