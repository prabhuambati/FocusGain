import { readFileSync, existsSync } from 'node:fs';
import { EVALUATION_DATASET } from '../src/evaluation/dataset';
import { calculateMetrics } from '../src/evaluation/metrics';
import { createOpenAIProvider } from '../src/providers/openai';
import { createAnthropicProvider } from '../src/providers/anthropic';
import { DEFAULT_SETTINGS } from '../src/shared/settings';
import type { ExtractedContent, ProviderId, Settings } from '../src/shared/types';

if (existsSync('.env')) { for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) { const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/); if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, ''); } }
const provider = (process.env.EVAL_PROVIDER || 'openai') as ProviderId; const apiKey = process.env.EVAL_API_KEY; if (!apiKey) { console.error('Set EVAL_API_KEY to run the real-provider evaluation. No results were generated.'); process.exit(1); }
const settings: Settings = { ...DEFAULT_SETTINGS, provider, apiKey, model: process.env.EVAL_MODEL || DEFAULT_SETTINGS.model };
const client = provider === 'openai' ? createOpenAIProvider() : createAnthropicProvider(); const predicted: string[] = [];
for (const example of EVALUATION_DATASET) { const content: ExtractedContent = { ...example, canonicalId: example.id, description: example.text, text: `${example.title}\n${example.text}`, extractedAt: Date.now(), url: `https://${example.platform}.test/${example.id}` }; const result = await client.classify({ content, settings, model: settings.model }); predicted.push(result.classification); console.log(`${example.id}: expected=${example.expected} predicted=${result.classification}`); }
console.log(JSON.stringify(calculateMetrics(EVALUATION_DATASET.map(e => e.expected), predicted), null, 2));
