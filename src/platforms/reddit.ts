import type { ExtractedContent } from '../shared/types';
export function isRedditContent(url = location.href): boolean { return /reddit\.com\/(r\/[^/]+\/comments\/|comments\/)/.test(url); }
export function extractRedditContent(doc: Document = document, url = location.href): ExtractedContent | null {
  if (!isRedditContent(url)) return null;
  const title = (doc.querySelector('h1')?.textContent || doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || doc.title).trim();
  const description = (doc.querySelector('[data-testid="post-container"]')?.textContent || doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || '').trim();
  const community = (doc.querySelector('a[href*="/r/"]')?.textContent || '').trim();
  const id = location.pathname.match(/comments\/([a-z0-9]+)/i)?.[1] || url;
  return { platform: 'reddit', url, canonicalId: id, title, description: description.slice(0, 5000), community, text: `${title}\n${description}`.slice(0, 6000), extractedAt: Date.now() };
}
