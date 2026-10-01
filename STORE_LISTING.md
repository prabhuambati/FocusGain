# Chrome Web Store listing draft

This document is a submission draft for IntelliBlock. It is not a publication confirmation and should be reviewed against the current Chrome Web Store policies before submission.

## Listing fields

- **Name:** IntelliBlock – AI-Powered Productivity Extension
- **Short description:** Context-aware productivity decisions for YouTube and Reddit, with local caching and privacy-first controls.
- **Category:** Productivity
- **Language:** English
- **Single purpose:** Help users make context-aware productivity decisions about YouTube and Reddit content.

## Detailed description

IntelliBlock is a privacy-first Chrome extension that evaluates supported YouTube videos and Reddit content using context rather than blocking entire domains. It can classify content as productive, distracting, or uncertain and then allow, warn, or block according to the user's settings.

Features:

- Context-aware classification for YouTube and Reddit.
- Productive, distracting, and uncertain outcomes with confidence, category, and a short reason.
- User-configurable productivity goal, sensitivity, categories, intervention behavior, platforms, model, and cache duration.
- OpenAI and Anthropic provider adapters behind one classification interface.
- Local cache with TTL and settings-aware reuse to avoid unnecessary repeated requests.
- Cost-aware routing between configured strong and cheaper models.
- Reversible intervention with an explicit Continue anyway option when enabled.
- Local analytics for classifications, interventions, overrides, cache hits, latency, avoided calls, and measurable provider usage.
- Local clear-data control.
- No IntelliBlock-owned backend and no project-owned browsing-history collection.

The extension sends only bounded metadata/content selected for classification to the provider configured by the user. Provider availability, provider terms, model behavior, and API charges are controlled by the selected provider and the user's account.

IntelliBlock does not claim to measure productivity improvement, time saved, or user intent.

## Permission justifications

- **Storage:** Save user settings, local cache entries, and local analytics events in Chrome extension storage.
- **YouTube host access:** Extract bounded metadata from YouTube pages and render an intervention when the user enables YouTube support.
- **Reddit host access:** Extract bounded post/community metadata from Reddit pages and render an intervention when the user enables Reddit support.
- **OpenAI API host access:** Send the user-selected bounded classification request directly to OpenAI when OpenAI is configured.
- **Anthropic API host access:** Send the user-selected bounded classification request directly to Anthropic when Anthropic is configured.

No remote scripts, eval-based code, or IntelliBlock-owned server are used.

## Data-use disclosure draft

IntelliBlock handles the following categories of data:

- **Website content:** Limited YouTube/Reddit titles, descriptions, author/community labels, and bounded text required for classification.
- **User settings:** Productivity goal, sensitivity, categories, provider/model choices, cache duration, and behavior settings.
- **Authentication information:** A provider API key entered by the user, stored in local Chrome extension storage. It is used to call the selected provider directly.
- **Usage statistics:** Locally stored classification, cache, latency, intervention, override, error, and measurable provider-usage events.

Data handling:

- IntelliBlock does not send browsing history to an IntelliBlock-owned server.
- Local cache and analytics remain in Chrome extension storage by default.
- Bounded website content may be sent to the provider selected by the user for classification.
- The selected provider may process data under its own terms and privacy policy.
- Users can clear IntelliBlock's local cache and analytics from Options.
- The client-side API key is not a fully secure secret vault; users should use a personal profile and rotate keys when appropriate.

The final Chrome Web Store privacy disclosures must be completed in the Developer Dashboard and must match the deployed code and privacy policy.

## Assets still required before submission

Capture these from the installed extension; do not use mockups or screenshots generated from source code:

1. Options page showing the productivity goal, provider privacy warning, platform selection, and QA controls.
2. Analytics dashboard showing local metrics and the truthful no-productivity-claims notice.
3. A distracting-content intervention on a supported YouTube video or individual Reddit post.
4. An uncertain-content intervention with the Continue anyway control visible, if enabled.

A stable public URL for `PRIVACY_POLICY.md` is also required after replacing its contact placeholder.
- Final review of the Chrome Web Store developer-program and data-use declarations.
