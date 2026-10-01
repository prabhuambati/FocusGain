# IntelliBlock Privacy Policy

**Draft for review — not yet hosted as the public store policy.**

Effective date: 2026-10-01

IntelliBlock is a Chrome extension that helps users make context-aware productivity decisions about supported YouTube and Reddit content. This policy describes the data handling of the IntelliBlock extension itself. Before Chrome Web Store submission, replace the contact placeholder and host this document at a stable public HTTPS URL.

## Contact

For privacy questions or deletion requests, contact: **[add maintainer contact before publication]**

## Data processed by IntelliBlock

When enabled for a supported site, IntelliBlock may read limited page information needed for classification, such as a title, short description, author or community, canonical content identifier, and bounded visible text. It does not need full page HTML or a complete browsing history.

The extension also stores:

- user settings;
- provider and model selection;
- the provider API key entered by the user;
- local classification cache entries; and
- local analytics events such as classification type, intervention, override, cache hit, latency, and provider usage when available.

## Where data goes

IntelliBlock has no project-owned backend. When the user configures a provider, the bounded classification request is sent directly from the extension to that provider's API. The provider may process the request under its own terms and privacy policy.

IntelliBlock does not sell personal information and does not send browsing history to an IntelliBlock-owned server. Local cache and analytics are stored in Chrome extension storage by default.

## API keys

Provider API keys are entered by the user and stored in local Chrome extension storage. Chrome extension storage is not a fully secure secret vault. Someone with access to the browser profile, extension debugging tools, or a compromised local environment may be able to retrieve a key. Users should use a personal browser profile, avoid sharing the profile, follow provider key restrictions, and rotate or revoke keys when appropriate.

## Retention and deletion

Local cache entries expire according to the configured cache duration. Local analytics are retained only in the extension's local storage limits and can be removed using the **Clear local cache and analytics** control in Options. Removing the extension or clearing its storage also removes locally stored IntelliBlock data subject to Chrome's behavior.

Data sent to a configured provider is subject to that provider's retention and deletion practices. Users should review the selected provider's current policy before using the extension with sensitive content.

## Security

The extension uses Manifest V3, typed extension messages, bounded extraction, a self-only extension-page content security policy, no `eval()`, and no remote script execution. These measures reduce risk but cannot eliminate risks from the browser, provider, or local environment.

## Changes

This policy will be updated if IntelliBlock's data practices change. The effective date above will be updated with material revisions.
