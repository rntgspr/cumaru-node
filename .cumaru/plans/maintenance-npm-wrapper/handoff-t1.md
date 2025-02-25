---
human_revised: false
plan: maintenance-npm-wrapper
task: T1
status: complete
date: 2026-11-17
summary: Framework guidance for Hand-off — maintenance-npm-wrapper / T1 and its required workflow.
---

# Hand-off — maintenance-npm-wrapper / T1

## Files touched

<!-- cumaru:touched -->
| Link | Description |
|------|-------------|
| [`bin/cumaru.js`](../../../bin/cumaru.js) | created — launcher that resolves the platform package binary and forwards args, stdio, and exit code |
| [`bin/platforms.json`](../../../bin/platforms.json) | created — single host-to-package-to-asset map shared by the launcher and the assemble script |
| [`package.json`](../../../package.json) | modified — main manifest with `bin`, `files`, `engines`, and `optionalDependencies` |
| [`README.md`](../../../README.md) | modified — install, platform, and release instructions |
<!-- /cumaru:touched -->

## Decisions made during implementation

- The platform map lives in `bin/platforms.json`, not in the launcher, so T2 reads the same source (DRY).
- The source `package.json` keeps version `0.0.0`; the assemble script stamps the real version.
- Linux packages omit `libc`, because upstream binaries are static musl builds.

## Commands run / verification

- `CUMARU_BINARY=$(command -v cumaru) node bin/cumaru.js --version` — `cumaru 0.15.1`, exit 0.
- `node bin/cumaru.js --version` without a platform package — clear error, exit 1.
- `CUMARU_BINARY=/usr/bin/false node bin/cumaru.js` — exit 1 forwarded.

## Pending / follow-ups

- The unsupported-platform branch was not executed on a real unsupported host.

## Suggestions for the Lead

- None.
