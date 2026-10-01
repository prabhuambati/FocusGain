# IntelliBlock v0.1.0

Initial public source release of IntelliBlock, an AI-powered and privacy-first Chrome extension for context-aware productivity decisions on YouTube and Reddit.

## Included in this release

- Manifest V3 Chrome extension architecture.
- Options page for productivity goals, sensitivity, categories, provider/model configuration, intervention behavior, uncertain-content behavior, cache duration, platform selection, and local QA controls.
- YouTube video-page and individual Reddit post metadata extraction with debounced navigation handling.
- OpenAI and Anthropic provider adapters with validated structured classification output.
- Productive, distracting, and uncertain classification states.
- Cost-aware cheap/strong model routing.
- Local exact and conservative near-duplicate cache with TTL and settings-aware keys.
- Reversible intervention overlay with explicit user override.
- Local analytics for classifications, interventions, overrides, cache hits, latency, avoided calls, and measurable provider cost.
- Explicit offline QA mode that exercises the real extension flow without making provider requests or pretending to be AI.
- Opt-in local diagnostics that store event metadata only and never store page text or API keys.
- Separate evaluation dataset and metrics runner.
- Runtime message validation, strict MV3 CSP, bounded extraction, and no project-owned backend.
- Credential-free GitHub Actions validation for typecheck, tests, and production builds.

## Verification performed

The repository was verified after the QA and release-documentation updates with:

- TypeScript compiler: passed.
- Automated tests: 19 passed across 12 test files.
- Production Vite build: passed.
- Store package validation: passed; generated archive contained 16 files and the required manifest, scripts, and icons.

No real-provider evaluation was run for this release. Offline QA scenarios are test fixtures, not model predictions. Therefore, this release does not claim classification accuracy, latency improvement, cost savings, or productivity improvement.

## Install from source

```bash
npm install
npm run typecheck
npm test
npm run build
```

Then open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select the generated `dist/` directory. Configure the provider and model from the IntelliBlock Options page.

## No-key manual QA

1. Open IntelliBlock Options.
2. Enable **Offline QA mode**.
3. Select `distracting`, `productive`, or `uncertain`.
4. Enable **Record local diagnostics**.
5. Save settings.
6. Open a YouTube video or individual Reddit post.
7. Confirm the intervention/allow behavior and inspect the local Analytics page.
8. Turn Offline QA mode off before testing a real provider.

Offline QA never calls OpenAI or Anthropic. It is intended to validate extraction, message passing, local caching, analytics, diagnostics, and the intervention UI when no API key is available.

## Security and privacy notes

- No project-owned backend is included; real provider calls are made directly from the extension.
- No API key is committed. `.env.example` contains placeholders only.
- API keys entered in Options are stored in local Chrome extension storage. Client-side extension storage is not a fully secure secret vault.
- Analytics, diagnostics, and cache are local by default and can be cleared from Options.
- The extension sends bounded page metadata/content rather than browsing history or full page HTML.

## Known limitations

- Provider availability and model output quality are external dependencies.
- A client-side API key cannot be made fully confidential by a browser extension.
- V1 classifies YouTube video pages and individual Reddit post pages; subreddit listing pages are not classified as one unit.
- YouTube and Reddit markup changes may require selector maintenance.
- Near-duplicate caching uses conservative token overlap rather than an embedding service.
- A real-provider evaluation must be run intentionally with a configured evaluation API key.
- Chrome Web Store packaging is prepared, but publication, signing, privacy-policy hosting, authentic screenshots, and live provider QA still require separate completion.

## Planned follow-ups

- Expand Reddit support to safely classify selected items on listing pages.
- Add optional user-controlled proxy support for stronger credential isolation.
- Add embedding-backed cache reuse behind the existing cache interface.
- Expand platform coverage and evaluation data with versioned, human-reviewed examples.
- Complete authentic Chrome Web Store screenshots and final data-use review.
