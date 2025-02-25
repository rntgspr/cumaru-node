---
human_revised: false
plan: maintenance-github-release
task: T2
status: complete
date: 2026-11-17
summary: Framework guidance for Hand-off — maintenance-github-release / T2 and its required workflow.
---

# Hand-off — maintenance-github-release / T2

## Files touched

<!-- cumaru:touched -->
| Link | Description |
|------|-------------|
| [`.github/workflows/ci.yml`](../../../.github/workflows/ci.yml) | created — assemble, pack, install, version, and exit-code checks on push and PR |
<!-- /cumaru:touched -->

## Decisions made during implementation

- CI resolves the latest upstream release with `gh release view -R rntgspr/cumaru`.

## Commands run / verification

- CI on `main` push — success, all steps green.
- Temporary draft PR with exit forwarding broken — CI failed at "Install and run the wrapper"; PR closed and branch deleted.

## Pending / follow-ups

- None.

## Suggestions for the Lead

- None.
