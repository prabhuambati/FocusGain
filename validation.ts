import type { ExtensionMessage } from './messages';

export function isValidExtensionMessage(value: unknown): value is ExtensionMessage {
  if (!value || typeof value !== 'object') return false;
  const message = value as Record<string, unknown>;
  if (message.type === 'OPEN_OPTIONS' || message.type === 'CLEAR_DATA') return true;
  if (message.type === 'OVERRIDE_CONTENT') return typeof message.contentId === 'string' && message.contentId.length <= 2048;
  if (message.type !== 'CLASSIFY_CONTENT' || !message.content || typeof message.content !== 'object') return false;
  const content = message.content as Record<string, unknown>;
  return (content.platform === 'youtube' || content.platform === 'reddit') &&
    typeof content.url === 'string' && content.url.length <= 4096 &&
    typeof content.canonicalId === 'string' && content.canonicalId.length <= 512 &&
    typeof content.title === 'string' && content.title.length <= 1000 &&
    typeof content.description === 'string' && content.description.length <= 6000 &&
    typeof content.text === 'string' && content.text.length <= 8000;
}
