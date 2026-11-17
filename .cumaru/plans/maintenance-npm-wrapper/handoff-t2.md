---
human_revised: false
plan: maintenance-npm-wrapper
task: T2
status: complete
date: 2026-11-17
summary: Framework guidance for Hand-off — maintenance-npm-wrapper / T2 and its required workflow.
---

# Hand-off — maintenance-npm-wrapper / T2

## Files touched

<!-- cumaru:touched -->
| Link | Description |
|------|-------------|
| [`scripts/assemble.mjs`](../../../scripts/assemble.mjs) | created — downloads release assets, verifies SHA-256, writes five packages to `npm/` |
| [`.gitignore`](../../../.gitignore) | modified — ignores the generated `npm/` directory |
<!-- /cumaru:touched -->

## Decisions made during implementation

- All assets are downloaded and verified before any write, so a mismatch leaves `npm/` untouched.
- `LICENSE` is taken from the release and verified like the binaries.
- `--base-url` exists only to test against a local mirror; production uses the GitHub Release URL.

## Commands run / verification

- `node scripts/assemble.mjs 0.15.1` — five packages written.
- `npm pack --dry-run` in each package — names and version `0.15.1` correct.
- Local install of the darwin-arm64 and main tarballs, then `node_modules/.bin/cumaru --version` — `cumaru 0.15.1`, exit 0; an invalid command forwarded exit 2.
- Tampered binary served from a local mirror — `checksum mismatch`, exit 1, `npm/` unchanged.
- `node scripts/assemble.mjs 1.2` — usage error, exit 2.

## Pending / follow-ups

- None.

## Suggestions for the Lead

- `npx --no cumaru --version` prints the npx version, not cumaru; test with `node_modules/.bin/cumaru` or `npx cumaru -- --version`.
