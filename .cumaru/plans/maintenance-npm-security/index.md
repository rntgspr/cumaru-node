---
human_revised: false
scope:
  - distribution/npm
status: drafting
summary: Move npm publishing from the 2FA-bypass token to trusted publishing (OIDC) before January 2027, and prove the wrapper installs under npm v12 install-time security defaults.
targets: [platform]
aux: []
---

# npm security: trusted publishing and npm v12 install defaults

## Overview

GitHub announced two npm changes
([changelog, 2026-07-08](https://github.blog/changelog/2026-07-08-npm-install-time-security-and-gat-bypass2fa-deprecation/),
[npm v12 breaking changes, 2026-06-09](https://github.blog/changelog/2026-06-09-upcoming-breaking-changes-for-npm-v12/)):

1. **2FA-bypass granular access tokens (GAT) are deprecated.** Since early August 2026 they no
   longer skip 2FA for sensitive account and package actions, including trusted publishing
   configuration. Around January 2027 they lose direct publish: they can only stage a publish
   that a human approves with 2FA.
2. **npm v12 install-time security is on by default.** `allowScripts` is off, so dependency
   `preinstall`/`install`/`postinstall` scripts and implicit `binding.gyp` builds do not run.
   `--allow-git` and `--allow-remote` default to `none`. npm `12.2.2` is `latest` today.

Impact on this repository:

- `publish.yml` authenticates with `NPM_TOKEN`, a 2FA-bypass GAT. It stops publishing around
  January 2027. The fix is trusted publishing (OIDC), which `publish.yml` already prepares for
  (`id-token: write`, `--provenance`).
- The wrapper ships binaries as `optionalDependencies` tarballs and has no install script, so
  npm v12 defaults should not affect it. This is inference; this plan proves it in CI.

This plan supersedes T6 of `maintenance-github-release`.

## Acceptance Criteria (EARS / RFC 2119)

- WHEN `publish.yml` publishes a version THE SYSTEM SHALL authenticate through npm trusted publishing (OIDC) without any npm token.
- WHEN a release is published after this plan closes THE SYSTEM SHALL publish all five `@cumaru/*` packages with provenance from `rntgspr/cumaru-node` / `publish.yml`.
- WHEN `@cumaru/cumaru` is installed with npm v12 default settings THE SYSTEM SHALL install the matching platform binary and run `cumaru version` without any `npm approve-scripts` step.
- WHEN an assembled manifest declares `preinstall`, `install`, `postinstall`, or `prepare`, or a package contains `binding.gyp` THE SYSTEM SHALL fail CI.
- The `NPM_TOKEN` secret MUST be deleted from `rntgspr/cumaru-node`, and the npm token MUST be revoked.
- No workflow MUST depend on a 2FA-bypass token.

## Plan / DAG

| Task | Title | Status | Depends on |
|------|-------|--------|-----------|
| [T1](t1.md) | Configure trusted publishers for the five packages | pending | — |
| [T2](t2.md) | Switch publish.yml to OIDC only | pending | T1 |
| [T3](t3.md) | Delete NPM_TOKEN and revoke the token | pending | T2 |
| [T4](t4.md) | CI guard for npm v12 install defaults | pending | — |

T4 is independent and can ship first. T1 needs Renato with interactive 2FA.

## Out of scope

- Staged publishing as the primary flow; it needs a human 2FA approval on every release and
  breaks the automatic upstream dispatch. It stays a fallback only.
- Changes to the upstream `rntgspr/cumaru` repository.

## Risks

- **Deadline.** Around January 2027 the current `NPM_TOKEN` stops publishing. An upstream
  release after that date fails to reach npm until T2 ships.
- **Trusted publisher setup needs 2FA.** Since August 2026 a 2FA-bypass token cannot change
  trusted publishing config, so T1 runs interactively on npmjs.com (or `npm trust` with 2FA).
- **npm CLI version in CI.** OIDC publishing needs a recent npm. Node 24 bundles npm 11; T2
  pins a minimum explicitly instead of relying on the bundled version. The exact minimum comes
  from [docs.npmjs.com/trusted-publishers](https://docs.npmjs.com/trusted-publishers), not yet read.
- **Unknown `0.0.0-stage` version** on `@cumaru/cli-linux-x64`, created by npm during the first
  publish. It may relate to staged publishing. Check during T1; do not unpublish without cause.
