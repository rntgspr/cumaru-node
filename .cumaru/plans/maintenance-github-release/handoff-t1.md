---
human_revised: false
plan: maintenance-github-release
task: T1
status: complete
date: 2026-11-17
summary: Framework guidance for Hand-off — maintenance-github-release / T1 and its required workflow.
---

# Hand-off — maintenance-github-release / T1

## Files touched

<!-- cumaru:touched -->
| Link | Description |
|------|-------------|
| [`package.json`](../../../package.json) | modified — `repository` and `homepage` point to `rntgspr/cumaru-node` |
<!-- /cumaru:touched -->

## Decisions made during implementation

- Created public repository `rntgspr/cumaru-node`; `origin` now points to it.
- Branch protection on `main` blocks deletion and force-push.

## Commands run / verification

- `gh repo create rntgspr/cumaru-node --public` — created.
- `node scripts/assemble.mjs 0.15.1` — all five manifests carry `github:rntgspr/cumaru-node`.
- `git ls-remote origin main` equals local `main` after push.

## Pending / follow-ups

- None.

## Suggestions for the Lead

- None.
