import { extractYouTubeContent, isYouTubeVideo } from './platforms/youtube';
import { extractRedditContent, isRedditContent } from './platforms/reddit';
import type { ClassificationResult } from './shared/types';
import type { ExtensionResponse } from './extension/messages';

let lastKey = ''; let timer: number | undefined; let overlay: HTMLElement | null = null;
const root = document.documentElement;
root.dataset.intelliblockContentScript = 'loaded';
root.dataset.intelliblockLastStatus = 'waiting_for_supported_content';
function currentContent() { return isYouTubeVideo() ? extractYouTubeContent() : isRedditContent() ? extractRedditContent() : null; }
function scheduleClassification() { window.clearTimeout(timer); timer = window.setTimeout(() => void classifyCurrent(), 850); }
async function classifyCurrent() {
  const content = currentContent();
  if (!content) { root.dataset.intelliblockLastStatus = 'unsupported_page'; return; }
  const key = `${content.platform}:${content.canonicalId}:${content.title}`;
  if (key === lastKey) return;
  lastKey = key;
  root.dataset.intelliblockLastStatus = `classifying_${content.platform}`;
  try {
    const response = await chrome.runtime.sendMessage({ type: 'CLASSIFY_CONTENT', content }) as ExtensionResponse;
    if (!response.ok) {
      root.dataset.intelliblockLastStatus = `fallback_${response.fallback}`;
      if (response.fallback === 'block') showOverlay('IntelliBlock could not classify this page.', response.error, false);
      else if (response.fallback === 'warn') showOverlay('IntelliBlock could not classify this page.', 'AI classification failed; review before continuing.', true);
      return;
    }
    root.dataset.intelliblockLastStatus = response.result ? `classified_${response.result.classification}` : 'allowed';
    if (response.result && response.result.classification !== 'productive' && response.action !== 'allow') {
      const title = response.result.classification === 'uncertain' ? 'IntelliBlock is uncertain about this content.' : 'This content looks distracting.';
      showOverlay(title, `${response.result.category}: ${response.result.reason}`, true, response.result);
    } else removeOverlay();
  } catch {
    root.dataset.intelliblockLastStatus = 'runtime_message_failed';
    showOverlay('IntelliBlock could not classify this page.', 'The extension service worker was unavailable. The page remains usable.', true);
  }
}
function showOverlay(title: string, reason: string, allowContinue: boolean, result?: ClassificationResult) {
  removeOverlay(); overlay = document.createElement('div'); overlay.id = 'intelliblock-overlay'; overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:rgba(10,15,30,.96);color:#f8fafc;display:grid;place-items:center;font:16px system-ui';
  const box = document.createElement('div'); box.style.cssText = 'max-width:520px;padding:36px;border:1px solid #334155;border-radius:18px;background:#111827;box-shadow:0 20px 80px #0008;text-align:center';
  const h = document.createElement('h1'); h.textContent = title; h.style.cssText = 'font-size:28px;margin:0 0 12px'; const p = document.createElement('p'); p.textContent = reason; p.style.cssText = 'color:#cbd5e1;line-height:1.6'; box.append(h,p);
  if (result?.fromCache) { const cache = document.createElement('small'); cache.textContent = 'Decision reused from local cache.'; cache.style.color = '#93c5fd'; box.append(cache); }
  if (allowContinue) { const button = document.createElement('button'); button.textContent = 'Continue anyway'; button.style.cssText = 'margin:22px 8px 0;padding:11px 18px;border:0;border-radius:10px;background:#38bdf8;color:#082f49;font-weight:700;cursor:pointer'; button.onclick = () => { void chrome.runtime.sendMessage({ type: 'OVERRIDE_CONTENT', contentId: location.href }); root.dataset.intelliblockLastStatus = 'user_override'; removeOverlay(); }; box.append(button); }
  const options = document.createElement('button'); options.textContent = 'Open IntelliBlock settings'; options.style.cssText = 'margin:22px 8px 0;padding:11px 18px;border:1px solid #64748b;border-radius:10px;background:transparent;color:#e2e8f0;cursor:pointer'; options.onclick = () => void chrome.runtime.sendMessage({ type: 'OPEN_OPTIONS' }); box.append(options); overlay.append(box); document.documentElement.append(overlay);
}
function removeOverlay() { overlay?.remove(); overlay = null; }
window.addEventListener('yt-navigate-finish', () => { lastKey = ''; scheduleClassification(); }); window.addEventListener('popstate', () => { lastKey = ''; scheduleClassification(); });
const observer = new MutationObserver(() => { if (isYouTubeVideo() || isRedditContent()) scheduleClassification(); }); observer.observe(document.documentElement, { childList: true, subtree: true });
scheduleClassification();
