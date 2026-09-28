import type { LLMProvider } from './types';
import type { ProviderRequest, ProviderResponse } from '../shared/types';
import { parseProviderJson } from '../classifier/parser';

export function createOpenAIProvider(fetcher: typeof fetch = fetch): LLMProvider {
  return { id: 'openai', async classify(request: ProviderRequest): Promise<ProviderResponse> {
    if (!request.settings.apiKey) throw new Error('missing_api_key');
    const prompt = buildPrompt(request);
    const response = await fetcher('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${request.settings.apiKey}` }, body: JSON.stringify({ model: request.model, temperature: 0, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: prompt }] }) });
    if (!response.ok) throw new Error(`provider_http_${response.status}`);
    const data = await response.json() as any;
    const parsed = parseProviderJson(data.choices?.[0]?.message?.content);
    return { ...parsed, usage: data.usage ? { inputTokens: data.usage.prompt_tokens, outputTokens: data.usage.completion_tokens, totalTokens: data.usage.total_tokens } : undefined };
  }};
}
const SYSTEM_PROMPT = 'You classify online content for a user\'s productivity goal. Return only JSON with classification (productive, distracting, or uncertain), confidence (0 to 1), category, and a short reason. Consider context, not isolated keywords. Respect the user goal and category preferences.';
function buildPrompt(r: ProviderRequest): string { return JSON.stringify({ goal: r.settings.productivityGoal, sensitivity: r.settings.sensitivity, blockedCategories: r.settings.blockedCategories, allowedCategories: r.settings.allowedCategories, content: { platform: r.content.platform, title: r.content.title, description: r.settings.sendDescription ? r.content.description : '', author: r.content.author, community: r.content.community, text: r.content.text.slice(0, 5000) } }); }
