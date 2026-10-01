import { getAnalyticsSummary } from '../analytics/analytics';
import { getSettings } from '../shared/settings';
import { readDiagnostics } from '../shared/storage';
import '../ui.css';

(async () => {
const app = document.querySelector<HTMLDivElement>('#app')!;
const [s, settings, diagnostics] = await Promise.all([getAnalyticsSummary(), getSettings(), readDiagnostics()]);
const pct = (n: number, d: number) => d ? `${Math.round(n / d * 100)}%` : '0%';
app.innerHTML = `<div class="shell"><header><div><p class="eyebrow">INTELLIBLOCK / ANALYTICS</p><h1>Your local focus signals.</h1><p class="muted">Only events recorded by IntelliBlock are shown. These are activity metrics, not claims about productivity improvement.</p></div><a class="button secondary" href="options.html">Settings</a></header><div class="metric-grid"><div class="metric"><span>Analyzed</span><strong>${s.totalAnalyzed}</strong></div><div class="metric"><span>Blocked</span><strong>${s.blocked}</strong></div><div class="metric"><span>Overrides</span><strong>${s.overrides}</strong></div><div class="metric"><span>Cache hit rate</span><strong>${pct(s.cacheHits, s.cacheHits + s.cacheMisses)}</strong></div><div class="metric"><span>Avg latency</span><strong>${s.averageLatencyMs} ms</strong></div><div class="metric"><span>Calls avoided</span><strong>${s.estimatedApiCallsAvoided}</strong></div></div><section class="card"><h2>Classification distribution</h2><div class="bars"><div><span>Productive</span><b style="width:${pct(s.productive,s.totalAnalyzed)}"></b><em>${s.productive}</em></div><div><span>Distracting</span><b class="pink" style="width:${pct(s.distracting,s.totalAnalyzed)}"></b><em>${s.distracting}</em></div><div><span>Uncertain</span><b class="amber" style="width:${pct(s.uncertain,s.totalAnalyzed)}"></b><em>${s.uncertain}</em></div></div><p class="muted">Estimated measurable provider cost recorded: $${s.estimatedCostUsd.toFixed(6)}. Cost is zero when a provider does not return token usage.</p></section><section class="card"><h2>Developer QA status</h2><p id="qa-status" class="muted"></p><p class="muted">Offline QA is a local test scenario, not an AI classification and not a productivity measurement.</p></section><section class="card"><h2>Recent diagnostics</h2><p class="muted">Diagnostics contain event metadata only; page text and API keys are not stored.</p><ol id="diagnostics"></ol></section></div>`;
const qaStatus = document.querySelector('#qa-status')!;
qaStatus.textContent = settings.offlineQaMode ? `Offline QA enabled: ${settings.offlineQaClassification}. Network calls are disabled.` : settings.diagnosticsEnabled ? 'Diagnostics enabled; real provider mode is active.' : 'Diagnostics disabled.';
const list = document.querySelector<HTMLOListElement>('#diagnostics')!;
for (const entry of diagnostics.slice(-20).reverse()) {
  const item = document.createElement('li');
  item.textContent = `${new Date(entry.timestamp).toLocaleString()} — ${entry.event}${entry.platform ? ` — ${entry.platform}` : ''}${entry.classification ? ` — ${entry.classification}` : ''}${entry.detail ? ` — ${entry.detail}` : ''}${entry.cacheHit ? ' — cache hit' : ''}`;
  list.append(item);
}
if (!diagnostics.length) { const item = document.createElement('li'); item.textContent = 'No diagnostics recorded yet.'; list.append(item); }
})();
