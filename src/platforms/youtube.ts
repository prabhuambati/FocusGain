import type { ExtractedContent } from '../shared/types';
export function isYouTubeVideo(url = location.href): boolean { return /youtube\.com\/watch\?v=|youtu\.be\//.test(url); }
export function extractYouTubeContent(doc: Document = document, url = location.href): ExtractedContent | null {
  if (!isYouTubeVideo(url)) return null;
  const title = (doc.querySelector('h1.ytd-watch-metadata yt-formatted-string')?.textContent || doc.querySelector('meta[name="title"]')?.getAttribute('content') || doc.title).trim();
  const description = (doc.querySelector('#description-inline-expander')?.textContent || doc.querySelector('meta[name="description"]')?.getAttribute('content') || '').trim();
  const author = (doc.querySelector('ytd-channel-name a')?.textContent || '').trim();
  const id = new URL(url).searchParams.get('v') || url;
  return { platform: 'youtube', url, canonicalId: id, title, description, author, text: `${title}\n${description}`.slice(0, 6000), extractedAt: Date.now() };
}
