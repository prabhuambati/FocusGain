# Chrome Web Store submission checklist

## Package

- [ ] Run `npm run typecheck`.
- [ ] Run `npm test` in a normal local or CI environment.
- [ ] Run `npm run package:store`.
- [ ] Confirm the ZIP root contains `manifest.json`.
- [ ] Confirm the ZIP contains no API keys, `.env` files, private keys, ZIP files, `node_modules`, or credentials.
- [ ] Load the ZIP contents as an unpacked extension and smoke-test it in Chrome.

## Store listing

- [ ] Review `STORE_LISTING.md` against the deployed build.
- [ ] Use authentic screenshots from the installed extension.
- [ ] Replace any placeholder text.
- [ ] Use Productivity as the category unless the dashboard requires another classification.
- [ ] Keep claims limited to measured or directly implemented behavior.

## Privacy and data use

- [ ] Replace the contact placeholder in `PRIVACY_POLICY.md`.
- [ ] Host the policy at a stable public HTTPS URL.
- [ ] Add the exact privacy-policy URL in the Developer Dashboard.
- [ ] Declare website content, settings, API-key handling, and local analytics consistently with the code.
- [ ] Explain that bounded content can be sent to the user's selected provider.
- [ ] Do not describe client-side API keys as fully secure.

## Manual QA

- [ ] Test the Options page and settings persistence.
- [ ] Test YouTube direct video navigation and SPA navigation.
- [ ] Test Reddit community and post navigation.
- [ ] Test productive, distracting, and uncertain outcomes with a configured provider.
- [ ] Test missing-key, timeout, rate-limit, invalid-output, and provider-error fallbacks.
- [ ] Test cache reuse and expiration.
- [ ] Test the dashboard and clear-data control.
- [ ] Enable offline QA mode and verify productive, distracting, and uncertain UI scenarios without a provider request.
- [ ] Enable diagnostics and verify recent event metadata appears locally without page text or API keys.
- [ ] Test Continue anyway and verify the local override event.

## Submission boundary

Preparing this repository does not publish or submit the extension. Uploading to the Chrome Web Store and sending it for review require a separate explicit approval.
