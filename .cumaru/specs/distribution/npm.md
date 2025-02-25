---
human_revised: false
name: npm
summary: npm publishing through OIDC trusted publishing and the CI guard for npm v12 install defaults.
depends-on: []
targets: [platform]
---

# npm

## Overview

`publish.yml` publishes the four `@cumaru/cli-*` platform packages and `@cumaru/cumaru`. It
authenticates with npm trusted publishing (OIDC); the repository holds no npm token. CI proves
that the wrapper installs and runs under npm v12 install-time security defaults.

## Requirements (EARS / RFC 2119)

### Publishing

- WHEN `publish.yml` publishes a version THE SYSTEM SHALL authenticate through npm trusted publishing (OIDC) without any npm token.
- WHEN `publish.yml` publishes a package THE SYSTEM SHALL attach provenance from `rntgspr/cumaru-node` / `publish.yml`.
- The npm trusted publisher of each of the five `@cumaru/*` packages MUST trust only `rntgspr/cumaru-node` / `publish.yml`, with `npm publish` allowed and `npm dist-tag` not allowed.
- `publish.yml` MUST NOT run through `workflow_call`, because npm validates the calling workflow. `sync.yml` MUST start it as a `workflow_dispatch` run.
- `publish.yml` MUST use npm 11.5.1 or later.
- No workflow MUST depend on an npm token or a 2FA-bypass token.

### Install-time safety

- WHEN CI runs THE SYSTEM SHALL install and run the wrapper with npm 12 defaults.
- WHEN an assembled manifest declares `preinstall`, `install`, `postinstall`, or `prepare`, or a package contains `binding.gyp` THE SYSTEM SHALL fail CI.

## Decisions

- 2026-11-18: moved from a 2FA-bypass npm token to trusted publishing before the January 2027 deprecation ([changelog](https://github.blog/changelog/2026-07-08-npm-install-time-security-and-gat-bypass2fa-deprecation/)). Staged publishing stays a fallback only, because it needs a human 2FA approval per release. `maintenance-npm-security`.
- 2026-11-18: closed with `@cumaru/cumaru` proven through OIDC (`0.15.1-rev2`); the first OIDC publish of the `@cumaru/cli-*` packages happens on the next upstream release. Closed at Renato's request.

## Reference

<!-- cumaru:reference -->
| Link | Description |
|------|-------------|
| [publish.yml](.github/workflows/publish.yml) | Publishes all packages through OIDC. |
| [sync.yml](.github/workflows/sync.yml) | Creates the release and starts `publish.yml`. |
| [ci.yml](.github/workflows/ci.yml) | Runs the install checks under npm 12. |
| [check-install-scripts.mjs](scripts/check-install-scripts.mjs) | Rejects install scripts and `binding.gyp`. |
<!-- /cumaru:reference -->
