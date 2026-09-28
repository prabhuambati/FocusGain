import { classifyContent } from './classifier/classifier';
import { createOpenAIProvider } from './providers/openai';
import { createAnthropicProvider } from './providers/anthropic';
import { loadSettings } from './shared/storage';
import { recordEvent } from './analytics/analytics';
import type { ExtensionMessage, ExtensionResponse } from './extension/messages';
import { isValidExtensionMessage } from './extension/validation';
import { fallbackAction } from './classifier/fallback';

const providers = { openai: createOpenAIProvider(), anthropic: createAnthropicProvider() };
chrome.runtime.onMessage.addListener((rawMessage, sender, sendResponse) => {
  if (!isValidExtensionMessage(rawMessage)) { sendResponse({ ok: false, error: 'invalid_message', fallback: 'allow' } satisfies ExtensionResponse); return false; }
  const message = rawMessage as ExtensionMessage;
  void handleMessage(message, sender).then(sendResponse).catch(async (error) => {
    const settings = await loadSettings();
    const code = error instanceof Error ? error.message : 'classification_failed';
    await recordEvent({ type: 'error', platform: message.type === 'CLASSIFY_CONTENT' ? message.content.platform : undefined, errorCode: code });
    const response: ExtensionResponse = { ok: false, error: code, fallback: fallbackAction(settings, code) };
    sendResponse(response);
  });
  return true;
});

async function handleMessage(message: ExtensionMessage, sender: chrome.runtime.MessageSender): Promise<ExtensionResponse> {
  if (message.type === 'OPEN_OPTIONS') { await chrome.runtime.openOptionsPage(); return { ok: true }; }
  if (message.type === 'CLEAR_DATA') { await chrome.storage.local.clear(); return { ok: true }; }
  if (message.type === 'OVERRIDE_CONTENT') { await recordEvent({ type: 'override', overridden: true }); return { ok: true }; }
  if (message.type !== 'CLASSIFY_CONTENT') return { ok: false, error: 'unsupported_message', fallback: 'allow' };
  const settings = await loadSettings();
  if (!settings.enabledPlatforms.includes(message.content.platform)) return { ok: true };
  const result = await classifyContent(message.content, settings, providers);
  const cost = estimateCost(result.model, result.usage?.inputTokens, result.usage?.outputTokens);
  await recordEvent({ type: 'classification', platform: message.content.platform, classification: result.classification, cacheHit: Boolean(result.fromCache), provider: result.provider, model: result.model, latencyMs: result.latencyMs, inputTokens: result.usage?.inputTokens, outputTokens: result.usage?.outputTokens, estimatedCostUsd: cost });
  const action = result.classification === 'distracting' ? settings.interventionMode : result.classification === 'uncertain' ? settings.uncertainBehavior : 'allow';
  const shouldBlock = action === 'block';
  if (result.classification !== 'productive') await recordEvent({ type: 'intervention', platform: message.content.platform, classification: result.classification, blocked: shouldBlock });
  return { ok: true, result, action };
}
function estimateCost(model: string, input?: number, output?: number): number { if (!input && !output) return 0; const rate = /mini|haiku/i.test(model) ? 0.0000005 : 0.000005; return Number((((input || 0) + (output || 0)) * rate).toFixed(6)); }
